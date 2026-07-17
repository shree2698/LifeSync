import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useCalendarStore, useTaskStore, useThemeStore } from '@lifesync/hooks';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing, Typography } from '@/constants/theme';

export default function CalendarScreen() {
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === 'dark' || theme === 'amoled';

  const {
    events,
    fetchEvents,
    createEvent,
    deleteEvent,
  } = useCalendarStore();

  const { tasks, fetchTasks } = useTaskStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('09:00');

  useEffect(() => {
    fetchEvents();
    fetchTasks();
  }, [fetchEvents, fetchTasks]);

  const handleCreateEvent = async () => {
    if (!title.trim()) return;
    
    const todayStr = new Date().toISOString().split('T')[0];
    const startISO = new Date(`${todayStr}T${time}:00`).toISOString();
    const endISO = new Date(new Date(`${todayStr}T${time}:00`).getTime() + 3600000).toISOString();

    const success = await createEvent({
      title: title.trim(),
      description: description.trim() || null,
      start: startISO,
      end: endISO,
      allDay: false,
      recurringRule: null,
    });

    if (success) {
      setTitle('');
      setDescription('');
    }
  };

  // Combine tasks with due dates today and calendar events
  const combinedAgenda = React.useMemo(() => {
    const list: Array<{ id: string; title: string; time: string; type: 'event' | 'task'; color: string }> = [];
    const todayStr = new Date().toISOString().split('T')[0];

    events.forEach((e) => {
      if (e.start.split('T')[0] === todayStr) {
        const tVal = e.start.split('T')[1].substring(0, 5);
        list.push({
          id: e.id,
          title: e.title,
          time: tVal,
          type: 'event',
          color: Colors.primary,
        });
      }
    });

    tasks.forEach((t) => {
      if (t.dueDate && t.dueDate.split('T')[0] === todayStr && t.status !== 'COMPLETED') {
        list.push({
          id: t.id,
          title: t.title,
          time: t.time || 'All Day',
          type: 'task',
          color: '#10B981',
        });
      }
    });

    list.sort((a, b) => a.time.localeCompare(b.time));
    return list;
  }, [events, tasks]);

  const cardBg = isDark ? Colors.dark.card : Colors.light.card;
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ThemedText style={{ color: Colors.primary }}>← Back</ThemedText>
        </TouchableOpacity>
        <ThemedText type="subtitle" style={styles.title}>
          Calendar Agenda
        </ThemedText>
      </View>

      {/* Schedule Form */}
      <View style={[styles.form, { backgroundColor: cardBg, borderColor }]}>
        <TextInput
          placeholder="Meeting title..."
          placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
          value={title}
          onChangeText={setTitle}
          style={[styles.input, { color: isDark ? '#FFFFFF' : '#000000' }]}
        />
        <View style={styles.formRow}>
          <TextInput
            placeholder="Time (e.g. 14:00)"
            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
            value={time}
            onChangeText={setTime}
            style={[styles.timeInput, { color: isDark ? '#FFFFFF' : '#000000' }]}
          />
          <TouchableOpacity onPress={handleCreateEvent} style={styles.addBtn}>
            <ThemedText style={styles.addBtnText}>Schedule</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Agenda List */}
      <ScrollView style={styles.list}>
        {combinedAgenda.length === 0 ? (
          <View style={styles.empty}>
            <ThemedText style={{ color: '#888', fontSize: 12 }}>No agenda scheduled for today.</ThemedText>
          </View>
        ) : (
          combinedAgenda.map((item) => (
            <View key={item.id} style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
              <View style={styles.cardInfo}>
                <View style={[styles.typeIndicator, { backgroundColor: item.color }]} />
                <View style={{ flex: 1 }}>
                  <ThemedText style={styles.eventTitle}>{item.title}</ThemedText>
                  <ThemedText style={styles.eventTime}>
                    🕒 {item.time} ({item.type})
                  </ThemedText>
                </View>
              </View>

              {item.type === 'event' && (
                <TouchableOpacity onPress={() => deleteEvent(item.id)}>
                  <ThemedText style={{ color: '#EF4444', fontSize: 11 }}>Cancel</ThemedText>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </ScrollView>
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
  form: {
    padding: Spacing.three,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: Spacing.four,
  },
  input: {
    fontSize: 14,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    marginBottom: Spacing.two,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeInput: {
    fontSize: 12,
    flex: 1,
    marginRight: Spacing.two,
  },
  addBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  list: {
    flex: 1,
  },
  empty: {
    padding: Spacing.four,
    alignItems: 'center',
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: Spacing.three,
    marginBottom: Spacing.two,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeIndicator: {
    width: 4,
    height: 24,
    borderRadius: 2,
    marginRight: Spacing.two,
  },
  eventTitle: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  eventTime: {
    fontSize: 10,
    color: '#888',
    marginTop: 2,
  },
});
