import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTaskStore, useGoalStore } from '@lifesync/hooks';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useThemeStore } from '@lifesync/hooks';
import { Task, Priority } from '@lifesync/types';

export default function TasksScreen() {
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === 'dark' || theme === 'amoled';

  const {
    tasks,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    createSubtask,
    toggleSubtask,
  } = useTaskStore();

  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newSubtask, setNewSubtask] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async () => {
    if (!title.trim()) return;
    const success = await createTask({
      title: title.trim(),
      description: null,
      status: 'TODO',
      priority,
      dueDate: null,
      startDate: null,
      time: null,
      estimatedDuration: null,
      color: priority === 'HIGH' ? '#F59E0B' : '#5B7FFF',
      icon: 'ClipboardList',
      pinned: false,
      favorite: false,
      recurringExpr: null,
      goalId: null,
      dependsOnId: null,
    });

    if (success) {
      setTitle('');
    }
  };

  const handleAddSubtask = async (taskId: string) => {
    if (!newSubtask.trim()) return;
    const success = await createSubtask(taskId, newSubtask.trim());
    if (success) {
      setNewSubtask('');
      // Reload details
      const updated = useTaskStore.getState().tasks.find((t) => t.id === taskId);
      if (updated) setSelectedTask(updated);
    }
  };

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case 'URGENT':
        return '#EF4444';
      case 'HIGH':
        return '#F59E0B';
      case 'MEDIUM':
        return '#3B82F6';
      case 'LOW':
        return '#6B7280';
    }
  };

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
          Tasks Agenda
        </ThemedText>
      </View>

      {/* Quick Add Form */}
      <View style={[styles.addForm, { backgroundColor: cardBg, borderColor }]}>
        <TextInput
          placeholder="New task..."
          placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
          value={title}
          onChangeText={setTitle}
          style={[styles.input, { color: isDark ? '#FFFFFF' : '#000000' }]}
        />
        <View style={styles.optionsRow}>
          {/* Priority triggers */}
          {(['LOW', 'MEDIUM', 'HIGH'] as Priority[]).map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => setPriority(p)}
              style={[
                styles.priorityBtn,
                { borderColor: getPriorityColor(p) },
                priority === p && { backgroundColor: getPriorityColor(p) + '20' },
              ]}>
              <ThemedText style={{ fontSize: 10, color: getPriorityColor(p), fontWeight: 'bold' }}>
                {p}
              </ThemedText>
            </TouchableOpacity>
          ))}

          <TouchableOpacity onPress={handleCreateTask} style={styles.addBtn}>
            <ThemedText style={styles.addBtnText}>Add</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} style={styles.list}>
        {tasks.map((task) => {
          const isExpanded = selectedTask?.id === task.id;
          const taskColor = getPriorityColor(task.priority);

          return (
            <View
              key={task.id}
              style={[styles.taskCard, { backgroundColor: cardBg, borderColor }]}>
              <TouchableOpacity
                onPress={() => setSelectedTask(isExpanded ? null : task)}
                style={styles.cardHeader}>
                <TouchableOpacity
                  onPress={() =>
                    updateTask(task.id, {
                      status: task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED',
                    })
                  }
                  style={styles.checkbox}>
                  <View
                    style={[
                      styles.checkboxInner,
                      task.status === 'COMPLETED' && { backgroundColor: Colors.primary },
                    ]}
                  />
                </TouchableOpacity>

                <View style={{ flex: 1, marginLeft: Spacing.two }}>
                  <ThemedText
                    style={[
                      styles.taskTitle,
                      task.status === 'COMPLETED' && {
                        textDecorationLine: 'line-through',
                        opacity: 0.6,
                      },
                    ]}>
                    {task.title}
                  </ThemedText>
                </View>

                <View style={[styles.priorityBadge, { backgroundColor: taskColor + '15' }]}>
                  <ThemedText style={{ fontSize: 9, color: taskColor, fontWeight: 'bold' }}>
                    {task.priority}
                  </ThemedText>
                </View>

                <TouchableOpacity
                  onPress={() => deleteTask(task.id)}
                  style={{ marginLeft: Spacing.two }}>
                  <ThemedText style={{ color: '#EF4444', fontSize: 12 }}>Delete</ThemedText>
                </TouchableOpacity>
              </TouchableOpacity>

              {/* Nested Subtasks Expandable Section */}
              {isExpanded && (
                <View style={styles.subtasksBlock}>
                  <ThemedText style={styles.subTitle}>Subtasks</ThemedText>
                  {task.subtasks?.map((sub) => (
                    <TouchableOpacity
                      key={sub.id}
                      onPress={() => toggleSubtask(sub.id, !sub.completed)}
                      style={styles.subtaskRow}>
                      <View
                        style={[
                          styles.subCheckbox,
                          sub.completed && { backgroundColor: Colors.primary },
                        ]}
                      />
                      <ThemedText
                        style={[
                          styles.subText,
                          sub.completed && { textDecorationLine: 'line-through', opacity: 0.6 },
                        ]}>
                        {sub.title}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}

                  {/* Add subtask */}
                  <View style={styles.subInputRow}>
                    <TextInput
                      placeholder="Add subtask..."
                      placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                      value={newSubtask}
                      onChangeText={setNewSubtask}
                      style={[styles.subInput, { color: isDark ? '#FFFFFF' : '#000000' }]}
                    />
                    <TouchableOpacity
                      onPress={() => handleAddSubtask(task.id)}
                      style={styles.subAddBtn}>
                      <ThemedText style={styles.subAddText}>+</ThemedText>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          );
        })}
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
  addForm: {
    borderRadius: 16,
    padding: Spacing.three,
    borderWidth: 1,
    marginBottom: Spacing.four,
  },
  input: {
    fontSize: 14,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    marginBottom: Spacing.two,
    paddingHorizontal: Spacing.one,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.one,
  },
  priorityBtn: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
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
  taskCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: Spacing.three,
    marginBottom: Spacing.two,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  taskTitle: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  priorityBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  subtasksBlock: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    marginTop: Spacing.three,
    paddingTop: Spacing.two,
  },
  subTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#888',
    marginBottom: Spacing.two,
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.one,
  },
  subCheckbox: {
    width: 14,
    height: 14,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 3,
    marginRight: Spacing.two,
  },
  subText: {
    fontSize: 12,
  },
  subInputRow: {
    flexDirection: 'row',
    marginTop: Spacing.two,
    alignItems: 'center',
  },
  subInput: {
    flex: 1,
    fontSize: 12,
    height: 32,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    borderRadius: 8,
    paddingHorizontal: Spacing.two,
  },
  subAddBtn: {
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.two,
  },
  subAddText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
