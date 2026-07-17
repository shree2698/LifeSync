import * as React from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useNotificationStore } from '@lifesync/hooks';
import { Spacing, BottomTabInset, MaxContentWidth } from '@/constants/theme';

export default function MobileNotificationsScreen() {
  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationStore();

  React.useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  if (isLoading && notifications.length === 0) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5B7FFF" />
        <ThemedText style={{ marginTop: Spacing.two }}>Loading Alerts...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <ThemedText type="title" style={styles.titleText}>
              Alerts & Notifications
            </ThemedText>
            <ThemedText type="small" style={styles.subtitleText}>
              {unreadCount > 0 ? `You have ${unreadCount} unread updates` : 'All caught up!'}
            </ThemedText>
          </View>

          {notifications.length > 0 ? (
            <TouchableOpacity onPress={markAllAsRead}>
              <ThemedText type="small" style={styles.clearAllText}>
                Mark all read
              </ThemedText>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* List */}
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ThemedText type="smallBold" style={styles.emptyText}>
                No new notifications
              </ThemedText>
              <ThemedText type="small" style={{ opacity: 0.6, textAlign: 'center', marginTop: 4 }}>
                We will notify you here when you have updates or tasks approaching.
              </ThemedText>
            </View>
          }
          renderItem={({ item }) => (
            <ThemedView
              type={item.read ? 'backgroundElement' : 'backgroundSelected'}
              style={[styles.notificationCard, !item.read && styles.unreadCard]}>
              <View style={styles.cardHeader}>
                <ThemedText
                  type="smallBold"
                  style={[styles.cardTitle, !item.read && { color: '#5B7FFF' }]}>
                  {item.title}
                </ThemedText>
                <View style={styles.actionRow}>
                  {!item.read && (
                    <TouchableOpacity
                      onPress={() => markAsRead(item.id)}
                      style={styles.actionButton}>
                      <ThemedText type="small" style={styles.actionText}>
                        Read
                      </ThemedText>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => deleteNotification(item.id)}
                    style={styles.actionButton}>
                    <ThemedText type="small" style={[styles.actionText, { color: '#EF4444' }]}>
                      Clear
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
              <ThemedText type="small" style={styles.cardBody}>
                {item.body}
              </ThemedText>
              <ThemedText type="small" style={styles.cardTime}>
                {new Date(item.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </ThemedText>
            </ThemedView>
          )}
        />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  subtitleText: {
    opacity: 0.6,
    marginTop: 2,
  },
  clearAllText: {
    color: '#5B7FFF',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.four,
    gap: Spacing.three,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.six,
  },
  emptyText: {
    fontSize: 16,
  },
  notificationCard: {
    borderRadius: 16,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: '#222',
    gap: Spacing.one,
  },
  unreadCard: {
    borderColor: '#5B7FFF30',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 13,
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  actionButton: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#00000040',
  },
  actionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5B7FFF',
  },
  cardBody: {
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.7,
  },
  cardTime: {
    fontSize: 10,
    opacity: 0.4,
    marginTop: Spacing.one,
    fontFamily: 'monospace',
  },
});
