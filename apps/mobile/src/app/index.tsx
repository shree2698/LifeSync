import * as React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuthStore, useThemeStore } from '@lifesync/hooks';
import { DashboardService } from '@lifesync/services';
import { DashboardData } from '@lifesync/types';
import { Spacing, BottomTabInset, MaxContentWidth, Colors } from '@/constants/theme';
import { formatCurrency } from '@lifesync/utils';

export default function MobileDashboardScreen() {
  const router = useRouter();
  const profile = useAuthStore((state) => state.profile);
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === 'dark' || theme === 'amoled';

  const [data, setData] = React.useState<DashboardData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchDashboard = React.useCallback(async () => {
    try {
      const res = await DashboardService.getDashboardData();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboard();
  };

  const greeting = React.useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  if (loading && !data) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5B7FFF" />
        <ThemedText style={{ marginTop: Spacing.two }}>Loading Dashboard...</ThemedText>
      </ThemedView>
    );
  }

  const cardBg = isDark ? Colors.dark.card : Colors.light.card;
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#5B7FFF" />
          }>
          {/* Welcome Header */}
          <View style={styles.header}>
            <View>
              <ThemedText type="smallBold" style={styles.dateText}>
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                })}
              </ThemedText>
              <ThemedText type="title" style={styles.greetingText}>
                {greeting}, {profile?.fullName?.split(' ')[0] || 'User'}
              </ThemedText>
            </View>
          </View>

          {/* AI Assistant Insight */}
          {data?.aiAssistant ? (
            <ThemedView type="backgroundElement" style={[styles.aiCard, { borderColor }]}>
              <View style={styles.cardHeader}>
                <ThemedText type="smallBold" style={styles.aiTitle}>
                  ✦ AI Daily Briefing
                </ThemedText>
              </View>
              <ThemedText type="small" style={styles.aiSummary}>
                {data.aiAssistant.summary}
              </ThemedText>
              <View style={[styles.aiSuggestionBox, { backgroundColor: isDark ? '#111' : '#F3F4F6' }]}>
                <ThemedText type="small" style={styles.aiSuggestion}>
                  💡 {data.aiAssistant.suggestion}
                </ThemedText>
              </View>
            </ThemedView>
          ) : null}

          {/* Productivity Hub Portals */}
          <ThemedView type="backgroundElement" style={[styles.hubCard, { backgroundColor: cardBg, borderColor }]}>
            <ThemedText type="smallBold" style={styles.widgetTitle}>
              Productivity Hub
            </ThemedText>
            <View style={styles.hubGrid}>
              <TouchableOpacity onPress={() => router.push('/tasks')} style={styles.hubButton}>
                <ThemedText style={styles.hubIcon}>✓</ThemedText>
                <ThemedText style={styles.hubText}>Tasks</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/habits')} style={styles.hubButton}>
                <ThemedText style={styles.hubIcon}>🔥</ThemedText>
                <ThemedText style={styles.hubText}>Habits</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/goals')} style={styles.hubButton}>
                <ThemedText style={styles.hubIcon}>🎯</ThemedText>
                <ThemedText style={styles.hubText}>Goals</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/notes')} style={styles.hubButton}>
                <ThemedText style={styles.hubIcon}>📝</ThemedText>
                <ThemedText style={styles.hubText}>Notes</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/calendar')} style={styles.hubButton}>
                <ThemedText style={styles.hubIcon}>📅</ThemedText>
                <ThemedText style={styles.hubText}>Agenda</ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>

          {/* Tasks & Habits widgets */}
          <View style={styles.gridRow}>
            {/* Tasks */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/tasks')}
              style={{ flex: 1 }}>
              <ThemedView type="backgroundElement" style={[styles.gridCard, { borderColor }]}>
                <ThemedText type="smallBold" style={styles.widgetTitle}>
                  Today&apos;s Tasks
                </ThemedText>
                <View style={styles.listContainer}>
                  {data?.tasks.slice(0, 3).map((task) => (
                    <View key={task.id} style={styles.listItem}>
                      <View
                        style={[
                          styles.bullet,
                          { backgroundColor: task.status === 'COMPLETED' ? '#10B981' : '#3B82F6' },
                        ]}
                      />
                      <ThemedText
                        type="small"
                        numberOfLines={1}
                        style={[
                          styles.listText,
                          task.status === 'COMPLETED' && { textDecorationLine: 'line-through', opacity: 0.6 },
                        ]}>
                        {task.title}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              </ThemedView>
            </TouchableOpacity>

            {/* Habits */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/habits')}
              style={{ flex: 1 }}>
              <ThemedView type="backgroundElement" style={[styles.gridCard, { borderColor }]}>
                <ThemedText type="smallBold" style={styles.widgetTitle}>
                  Habit Rituals
                </ThemedText>
                <View style={styles.listContainer}>
                  {data?.habits.slice(0, 3).map((habit) => (
                    <View key={habit.id} style={styles.listItem}>
                      <ThemedText type="small" style={styles.listText} numberOfLines={1}>
                        🔥 {habit.streak}d {habit.title}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              </ThemedView>
            </TouchableOpacity>
          </View>

          {/* Health & Finances widgets */}
          <View style={styles.gridRow}>
            {/* Health */}
            <ThemedView type="backgroundElement" style={[styles.gridCard, { borderColor }]}>
              <ThemedText type="smallBold" style={styles.widgetTitle}>
                Health Metrics
              </ThemedText>
              <View style={styles.metricsContainer}>
                <View style={styles.metricRow}>
                  <ThemedText type="small" style={{ opacity: 0.7 }}>
                    💧 Water
                  </ThemedText>
                  <ThemedText type="smallBold">
                    {data ? data.health.waterIntakeMl / 1000 : 0}L / {data ? data.health.waterGoalMl / 1000 : 0}L
                  </ThemedText>
                </View>
                <View style={styles.metricRow}>
                  <ThemedText type="small" style={{ opacity: 0.7 }}>
                    🛌 Sleep
                  </ThemedText>
                  <ThemedText type="smallBold">{data?.health.sleepHours} hrs</ThemedText>
                </View>
                <View style={styles.metricRow}>
                  <ThemedText type="small" style={{ opacity: 0.7 }}>
                    🏃 Active
                  </ThemedText>
                  <ThemedText type="smallBold">{data?.health.workoutMinutes} mins</ThemedText>
                </View>
              </View>
            </ThemedView>

            {/* Finances */}
            <ThemedView type="backgroundElement" style={[styles.gridCard, { borderColor }]}>
              <ThemedText type="smallBold" style={styles.widgetTitle}>
                Finances Overview
              </ThemedText>
              <View style={styles.metricsContainer}>
                <View style={styles.metricRow}>
                  <ThemedText type="small" style={{ opacity: 0.7 }}>
                    Savings
                  </ThemedText>
                  <ThemedText type="smallBold" style={{ color: '#16C784' }}>
                    {data ? formatCurrency(data.finance.balance) : '$0'}
                  </ThemedText>
                </View>
                <View style={styles.metricRow}>
                  <ThemedText type="small" style={{ opacity: 0.7 }}>
                    Income
                  </ThemedText>
                  <ThemedText type="smallBold">
                    {data ? formatCurrency(data.finance.income) : '$0'}
                  </ThemedText>
                </View>
                <View style={styles.metricRow}>
                  <ThemedText type="small" style={{ opacity: 0.7 }}>
                    Expenses
                  </ThemedText>
                  <ThemedText type="smallBold" style={{ color: '#EF4444' }}>
                    {data ? formatCurrency(data.finance.expenses) : '$0'}
                  </ThemedText>
                </View>
              </View>
            </ThemedView>
          </View>

          {/* Objectives / Goals widget */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/goals')}>
            <ThemedView type="backgroundElement" style={[styles.fullWidthCard, { borderColor }]}>
              <ThemedText type="smallBold" style={styles.widgetTitle}>
                Objectives & Goals
              </ThemedText>
              <View style={{ gap: Spacing.two, marginTop: Spacing.one }}>
                {data?.goals.slice(0, 2).map((goal) => {
                  const percentage = Math.round((goal.progress / goal.target) * 100);
                  return (
                    <View key={goal.id} style={styles.goalContainer}>
                      <View style={styles.goalHeader}>
                        <ThemedText type="small" style={{ fontWeight: '600' }} numberOfLines={1}>
                          {goal.title}
                        </ThemedText>
                        <ThemedText type="smallBold" style={{ color: '#5B7FFF' }}>
                          {percentage}%
                        </ThemedText>
                      </View>
                      <View style={[styles.progressBarBg, { backgroundColor: isDark ? '#222' : '#E5E7EB' }]}>
                        <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
                      </View>
                    </View>
                  );
                })}
              </View>
            </ThemedView>
          </TouchableOpacity>

          {/* Calendar Events widget */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/calendar')}>
            <ThemedView type="backgroundElement" style={[styles.fullWidthCard, { borderColor }]}>
              <ThemedText type="smallBold" style={styles.widgetTitle}>
                Today&apos;s Schedule
              </ThemedText>
              <View style={{ gap: Spacing.two, marginTop: Spacing.two }}>
                {data?.calendar.slice(0, 2).map((event) => (
                  <View key={event.id} style={styles.eventRow}>
                    <View style={styles.eventLeftAccent} />
                    <View>
                      <ThemedText type="smallBold">{event.title}</ThemedText>
                      <ThemedText type="small" style={{ opacity: 0.6, fontSize: 11, marginTop: 2 }}>
                        ⏱️ {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </ThemedText>
                    </View>
                  </View>
                ))}
              </View>
            </ThemedView>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
  },
  scrollContent: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.five,
    gap: Spacing.three,
  },
  header: {
    marginBottom: Spacing.two,
  },
  dateText: {
    opacity: 0.6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 10,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  aiCard: {
    borderRadius: 16,
    padding: Spacing.three,
    borderWidth: 1,
  },
  cardHeader: {
    marginBottom: Spacing.one,
  },
  aiTitle: {
    color: '#5B7FFF',
    fontSize: 13,
  },
  aiSummary: {
    lineHeight: 18,
    opacity: 0.8,
    fontSize: 12,
  },
  aiSuggestionBox: {
    marginTop: Spacing.two,
    padding: Spacing.two,
    borderRadius: 8,
  },
  aiSuggestion: {
    fontWeight: '600',
    color: '#5B7FFF',
    fontSize: 11,
  },
  hubCard: {
    borderRadius: 16,
    padding: Spacing.three,
    borderWidth: 1,
  },
  hubGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.one,
  },
  hubButton: {
    alignItems: 'center',
    width: '18%',
  },
  hubIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  hubText: {
    fontSize: 10,
    fontWeight: 'bold',
    opacity: 0.7,
  },
  gridRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  gridCard: {
    flex: 1,
    borderRadius: 16,
    padding: Spacing.three,
    borderWidth: 1,
  },
  widgetTitle: {
    fontSize: 13,
    opacity: 0.7,
    marginBottom: Spacing.two,
  },
  listContainer: {
    gap: Spacing.two,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  bullet: {
    height: 6,
    width: 6,
    borderRadius: 3,
  },
  listText: {
    fontSize: 12,
  },
  metricsContainer: {
    gap: Spacing.two,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fullWidthCard: {
    borderRadius: 16,
    padding: Spacing.three,
    borderWidth: 1,
  },
  goalContainer: {
    gap: Spacing.one,
    marginTop: Spacing.one,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#5B7FFF',
    borderRadius: 3,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  eventLeftAccent: {
    width: 3,
    height: 28,
    backgroundColor: '#5B7FFF',
    borderRadius: 2,
  },
});
