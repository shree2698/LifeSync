import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useHabitStore, useThemeStore } from '@lifesync/hooks';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing, Typography } from '@/constants/theme';

export default function HabitsScreen() {
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === 'dark' || theme === 'amoled';

  const {
    habits,
    fetchHabits,
    createHabit,
    deleteHabit,
    toggleHabit,
  } = useHabitStore();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Personal');

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const handleCreateHabit = async () => {
    if (!title.trim()) return;
    const success = await createHabit({
      title: title.trim(),
      frequency: 'DAILY',
      customFreq: null,
      reminderTime: '08:00',
      category,
    });
    if (success) {
      setTitle('');
    }
  };

  const last7Days = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({
        dateStr: d.toISOString().split('T')[0],
        label: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      });
    }
    return days;
  }, []);

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
          Habit Rituals
        </ThemedText>
      </View>

      {/* Habit Form */}
      <View style={[styles.form, { backgroundColor: cardBg, borderColor }]}>
        <TextInput
          placeholder="New habit name..."
          placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
          value={title}
          onChangeText={setTitle}
          style={[styles.input, { color: isDark ? '#FFFFFF' : '#000000' }]}
        />
        <View style={styles.formActions}>
          <TextInput
            placeholder="Category (e.g. Health)"
            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
            value={category}
            onChangeText={setCategory}
            style={[styles.catInput, { color: isDark ? '#FFFFFF' : '#000000' }]}
          />
          <TouchableOpacity onPress={handleCreateHabit} style={styles.addBtn}>
            <ThemedText style={styles.addBtnText}>Add</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Habits List */}
      <ScrollView style={styles.list}>
        {habits.map((habit) => (
          <View key={habit.id} style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            <View style={styles.cardHeader}>
              <View>
                <ThemedText style={styles.habitTitle}>{habit.title}</ThemedText>
                <ThemedText style={styles.habitStreak}>
                  🔥 {habit.streak} day streak ({habit.category})
                </ThemedText>
              </View>
              <TouchableOpacity onPress={() => deleteHabit(habit.id)}>
                <ThemedText style={{ color: '#EF4444', fontSize: 11 }}>Delete</ThemedText>
              </TouchableOpacity>
            </View>

            {/* Last 7 Days logs grid */}
            <View style={styles.logsGrid}>
              {last7Days.map((day) => {
                const isCompleted = habit.logs?.some((l) => l.completedAt === day.dateStr);
                return (
                  <TouchableOpacity
                    key={day.dateStr}
                    onPress={() => toggleHabit(habit.id, day.dateStr)}
                    style={[
                      styles.logCell,
                      { borderColor },
                      isCompleted && { backgroundColor: '#F97316', borderColor: '#F97316' },
                    ]}>
                    <ThemedText
                      style={[
                        styles.logLabel,
                        isCompleted && { color: '#FFFFFF', fontWeight: 'bold' },
                      ]}>
                      {day.label}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
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
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catInput: {
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
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: Spacing.three,
    marginBottom: Spacing.two,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.04)',
    paddingBottom: Spacing.two,
    marginBottom: Spacing.two,
  },
  habitTitle: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  habitStreak: {
    fontSize: 10,
    color: '#F97316',
    fontWeight: 'bold',
    marginTop: 2,
  },
  logsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logCell: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logLabel: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});
