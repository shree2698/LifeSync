import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useNoteStore, useThemeStore } from '@lifesync/hooks';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { Note } from '@lifesync/types';

export default function NotesScreen() {
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === 'dark' || theme === 'amoled';

  const {
    notes,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
  } = useNoteStore();

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setEditTitle(note.title);
    setEditContent(note.content || '');
  };

  const handleSaveNote = async () => {
    if (!selectedNote) return;
    const success = await updateNote(selectedNote.id, {
      title: editTitle,
      content: editContent,
    });
    if (success) {
      setSelectedNote(null);
    }
  };

  const handleCreateNote = async () => {
    const success = await createNote({
      title: 'New mobile note',
      content: '## Checklists\n- [ ] Code React Native Layouts\n- [ ] Connect shared Zustand stores\n',
      pinned: false,
      folderId: null,
    });
    if (success) {
      // Auto-select latest note
      const latest = useNoteStore.getState().notes;
      if (latest.length > 0) {
        handleSelectNote(latest[latest.length - 1]);
      }
    }
  };

  // Parses markdown checklist lines
  const renderChecklist = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const isChecked = line.startsWith('- [x]') || line.startsWith('- [X]');
      const isUnchecked = line.startsWith('- [ ]');
      if (isChecked || isUnchecked) {
        return (
          <TouchableOpacity
            key={idx}
            onPress={() => handleToggleChecklistItem(idx, line)}
            style={styles.checklistRow}>
            <View
              style={[
                styles.checklistCheck,
                isChecked && { backgroundColor: Colors.primary },
              ]}
            />
            <ThemedText
              style={[
                styles.checklistText,
                isChecked && { textDecorationLine: 'line-through', opacity: 0.6 },
              ]}>
              {line.substring(6)}
            </ThemedText>
          </TouchableOpacity>
        );
      }
      return null;
    });
  };

  const handleToggleChecklistItem = async (lineIdx: number, lineContent: string) => {
    if (!selectedNote) return;
    const lines = editContent.split('\n');
    if (lineContent.startsWith('- [ ]')) {
      lines[lineIdx] = '- [x] ' + lineContent.substring(6);
    } else {
      lines[lineIdx] = '- [ ] ' + lineContent.substring(6);
    }
    const updated = lines.join('\n');
    setEditContent(updated);
    await updateNote(selectedNote.id, { content: updated });
  };

  const cardBg = isDark ? Colors.dark.card : Colors.light.card;
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => (selectedNote ? setSelectedNote(null) : router.back())}
          style={styles.backButton}>
          <ThemedText style={{ color: Colors.primary }}>← Back</ThemedText>
        </TouchableOpacity>
        <ThemedText type="subtitle" style={styles.title}>
          {selectedNote ? 'Edit Note' : 'Markdown Notes'}
        </ThemedText>
      </View>

      {selectedNote ? (
        /* Note Editor View */
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} style={styles.editor}>
          <ThemedText style={styles.label}>Title</ThemedText>
          <TextInput
            placeholder="Title"
            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
            value={editTitle}
            onChangeText={setEditTitle}
            style={[styles.titleInput, { color: isDark ? '#FFFFFF' : '#000000', borderColor }]}
          />

          <ThemedText style={styles.label}>Markdown Body</ThemedText>
          <TextInput
            placeholder="Start drafting markdown..."
            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
            value={editContent}
            onChangeText={setEditContent}
            multiline
            style={[
              styles.contentInput,
              { color: isDark ? '#FFFFFF' : '#000000', borderColor, backgroundColor: cardBg },
            ]}
          />

          {/* Render parsed checklist interactive triggers */}
          <View style={styles.previewBlock}>
            <ThemedText style={styles.label}>Interactive Checklist Preview</ThemedText>
            {renderChecklist(editContent)}
          </View>

          <View style={styles.editorActions}>
            <TouchableOpacity onPress={handleSaveNote} style={styles.saveBtn}>
              <ThemedText style={styles.saveBtnText}>Save and Close</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => deleteNote(selectedNote.id).then(() => setSelectedNote(null))}
              style={styles.deleteBtn}>
              <ThemedText style={{ color: '#EF4444', fontWeight: 'bold' }}>Delete</ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        /* Note Listing View */
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={handleCreateNote} style={styles.addBtn}>
            <ThemedText style={styles.addBtnText}>+ Create New Note</ThemedText>
          </TouchableOpacity>

          <ScrollView style={styles.list}>
            {notes.map((note) => (
              <TouchableOpacity
                key={note.id}
                onPress={() => handleSelectNote(note)}
                style={[styles.noteCard, { backgroundColor: cardBg, borderColor }]}>
                <ThemedText style={styles.noteTitle}>{note.title || 'Untitled'}</ThemedText>
                <ThemedText style={styles.noteSnippet} numberOfLines={2}>
                  {note.content || 'Empty note content...'}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  backButton: {
    marginRight: Spacing.three,
  },
  title: {
    ...Typography.subtitle,
    fontWeight: 'bold',
  },
  addBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  noteCard: {
    padding: Spacing.three,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: Spacing.two,
  },
  noteTitle: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  noteSnippet: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
  },
  editor: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#888',
    marginBottom: 4,
    marginTop: Spacing.two,
    textTransform: 'uppercase',
  },
  titleInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: Spacing.two,
    fontSize: 14,
    marginBottom: Spacing.two,
  },
  contentInput: {
    height: 140,
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.two,
    fontSize: 12,
    fontFamily: 'monospace',
    textAlignVertical: 'top',
    marginBottom: Spacing.three,
  },
  previewBlock: {
    marginTop: Spacing.two,
    marginBottom: Spacing.four,
  },
  checklistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.one,
  },
  checklistCheck: {
    width: 14,
    height: 14,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 3,
    marginRight: Spacing.two,
  },
  checklistText: {
    fontSize: 12,
  },
  editorActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.two,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  deleteBtn: {
    padding: Spacing.two,
  },
});
