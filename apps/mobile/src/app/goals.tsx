import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useGoalStore, useThemeStore } from '@lifesync/hooks';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { Goal, Priority } from '@lifesync/types';

export default function GoalsScreen() {
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === 'dark' || theme === 'amoled';

  const {
    goals,
    fetchGoals,
    createGoal,
    deleteGoal,
    createMilestone,
    toggleMilestone,
    deleteMilestone,
  } = useGoalStore();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Work');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [newMilestone, setNewMilestone] = useState('');

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleCreateGoal = async () => {
    if (!title.trim()) return;
    const success = await createGoal({
      title: title.trim(),
      category,
      target: 100,
      deadline: null,
      status: 'ACTIVE',
      priority: 'MEDIUM',
    });
    if (success) {
      setTitle('');
    }
  };

  const handleAddMilestone = async (goalId: string) => {
    if (!newMilestone.trim()) return;
    const success = await createMilestone(goalId, newMilestone.trim());
    if (success) {
      setNewMilestone('');
      // Refresh selected goal reference
      const updated = useGoalStore.getState().goals.find((g) => g.id === goalId);
      if (updated) setSelectedGoal(updated);
    }
  };

  const handleToggleM = async (mId: string, goalId: string) => {
    const success = await toggleMilestone(mId);
    if (success) {
      const updated = useGoalStore.getState().goals.find((g) => g.id === goalId);
      if (updated) setSelectedGoal(updated);
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
          Objectives & Goals
        </ThemedText>
      </View>

      {/* Goal Form */}
      <View style={[styles.form, { backgroundColor: cardBg, borderColor }]}>
        <TextInput
          placeholder="New goal target..."
          placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
          value={title}
          onChangeText={setTitle}
          style={[styles.input, { color: isDark ? '#FFFFFF' : '#000000' }]}
        />
        <View style={styles.formActions}>
          <TextInput
            placeholder="Category (e.g. Work)"
            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
            value={category}
            onChangeText={setCategory}
            style={[styles.catInput, { color: isDark ? '#FFFFFF' : '#000000' }]}
          />
          <TouchableOpacity onPress={handleCreateGoal} style={styles.addBtn}>
            <ThemedText style={styles.addBtnText}>Add</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Goals List */}
      <ScrollView style={styles.list}>
        {goals.map((goal) => {
          const isExpanded = selectedGoal?.id === goal.id;
          return (
            <View key={goal.id} style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
              <TouchableOpacity
                onPress={() => setSelectedGoal(isExpanded ? null : goal)}
                style={styles.cardHeader}>
                <View>
                  <ThemedText style={styles.goalTitle}>{goal.title}</ThemedText>
                  <ThemedText style={styles.goalCategory}>
                    {goal.category} • {goal.progress}% completed
                  </ThemedText>
                </View>
                <TouchableOpacity onPress={() => deleteGoal(goal.id).then(() => setSelectedGoal(null))}>
                  <ThemedText style={{ color: '#EF4444', fontSize: 11 }}>Delete</ThemedText>
                </TouchableOpacity>
              </TouchableOpacity>

              {/* Progress bar */}
              <View style={styles.progressRow}>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${goal.progress}%` }]} />
                </View>
              </View>

              {/* Expandable Milestones checklist */}
              {isExpanded && (
                <View style={styles.milestoneBlock}>
                  <ThemedText style={styles.blockTitle}>Milestones</ThemedText>
                  {goal.milestones?.map((m) => (
                    <TouchableOpacity
                      key={m.id}
                      onPress={() => handleToggleM(m.id, goal.id)}
                      style={styles.milestoneRow}>
                      <View
                        style={[
                          styles.milestoneBox,
                          m.completed && { backgroundColor: Colors.primary },
                        ]}
                      />
                      <ThemedText
                        style={[
                          styles.milestoneText,
                          m.completed && { textDecorationLine: 'line-through', opacity: 0.6 },
                        ]}>
                        {m.title}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}

                  {/* Add Milestone input */}
                  <View style={styles.mInputRow}>
                    <TextInput
                      placeholder="Add milestone..."
                      placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                      value={newMilestone}
                      onChangeText={setNewMilestone}
                      style={[styles.mInput, { color: isDark ? '#FFFFFF' : '#000000' }]}
                    />
                    <TouchableOpacity
                      onPress={() => handleAddMilestone(goal.id)}
                      style={styles.mAddBtn}>
                      <ThemedText style={styles.mAddBtnText}>+</ThemedText>
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
  },
  goalTitle: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  goalCategory: {
    fontSize: 10,
    color: '#888',
    marginTop: 2,
  },
  progressRow: {
    marginTop: Spacing.two,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  milestoneBlock: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    marginTop: Spacing.three,
    paddingTop: Spacing.two,
  },
  blockTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#888',
    marginBottom: Spacing.two,
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.one,
  },
  milestoneBox: {
    width: 14,
    height: 14,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 3,
    marginRight: Spacing.two,
  },
  milestoneText: {
    fontSize: 12,
  },
  mInputRow: {
    flexDirection: 'row',
    marginTop: Spacing.two,
    alignItems: 'center',
  },
  mInput: {
    flex: 1,
    fontSize: 12,
    height: 32,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    borderRadius: 8,
    paddingHorizontal: Spacing.two,
  },
  mAddBtn: {
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.two,
  },
  mAddBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
