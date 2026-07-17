import * as React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeStore } from '@lifesync/hooks';
import { SettingsService } from '@lifesync/services';
import { ThemeMode } from '@lifesync/types';
import { Spacing, BottomTabInset, MaxContentWidth } from '@/constants/theme';

export default function MobileSettingsScreen() {
  const { theme, setTheme } = useThemeStore();
  const [marketingEmails, setMarketingEmails] = React.useState(false);
  const [securityAlerts, setSecurityAlerts] = React.useState(true);
  const [pushNotifications, setPushNotifications] = React.useState(true);
  const [currency, setCurrency] = React.useState('USD');
  const [language, setLanguage] = React.useState('en');
  
  const [loading, setLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  React.useEffect(() => {
    async function loadSettings() {
      const res = await SettingsService.getSettings();
      if (res.success && res.data) {
        setMarketingEmails(res.data.marketingEmails);
        setSecurityAlerts(res.data.securityAlerts);
        setPushNotifications(res.data.pushNotifications);
        setCurrency(res.data.currency);
        setLanguage(res.data.language);
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    const res = await SettingsService.updateSettings({
      theme: theme as ThemeMode,
      marketingEmails,
      securityAlerts,
      pushNotifications,
      currency,
      language,
    });

    setIsSaving(false);
    if (res.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5B7FFF" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText type="title" style={styles.titleText}>
              System Preferences
            </ThemedText>
            <ThemedText type="small" style={{ opacity: 0.6 }}>
              Configure your visual appearance and alert frequency
            </ThemedText>
          </View>

          {/* Theme Selector */}
          <View style={styles.section}>
            <ThemedText type="smallBold" style={styles.sectionHeader}>
              Theme Preference
            </ThemedText>
            <View style={styles.themeRow}>
              {[
                { id: 'light' as const, label: '☀️ Light' },
                { id: 'dark' as const, label: '🌙 Dark' },
                { id: 'amoled' as const, label: '🖤 Black' },
              ].map((mode) => {
                const isSelected = theme === mode.id;
                return (
                  <TouchableOpacity
                    key={mode.id}
                    onPress={() => setTheme(mode.id)}
                    style={[
                      styles.themeButton,
                      isSelected && styles.themeButtonSelected,
                    ]}>
                    <ThemedText
                      type="smallBold"
                      style={[
                        styles.themeButtonText,
                        isSelected && { color: '#ffffff' },
                      ]}>
                      {mode.label}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Notification toggles */}
          <View style={styles.section}>
            <ThemedText type="smallBold" style={styles.sectionHeader}>
              Alerts & Notifications
            </ThemedText>
            <ThemedView type="backgroundElement" style={styles.toggleCard}>
              <View style={styles.toggleRow}>
                <View style={{ flex: 1 }}>
                  <ThemedText type="smallBold">Push Notifications</ThemedText>
                  <ThemedText type="small" style={styles.toggleSubText}>
                    Receive alarms & progress updates
                  </ThemedText>
                </View>
                <Switch
                  value={pushNotifications}
                  onValueChange={setPushNotifications}
                  trackColor={{ true: '#5B7FFF', false: '#333' }}
                />
              </View>

              <View style={styles.toggleDivider} />

              <View style={styles.toggleRow}>
                <View style={{ flex: 1 }}>
                  <ThemedText type="smallBold">Security Alerts</ThemedText>
                  <ThemedText type="small" style={styles.toggleSubText}>
                    Important password & access warnings
                  </ThemedText>
                </View>
                <Switch
                  value={securityAlerts}
                  onValueChange={setSecurityAlerts}
                  trackColor={{ true: '#5B7FFF', false: '#333' }}
                />
              </View>

              <View style={styles.toggleDivider} />

              <View style={styles.toggleRow}>
                <View style={{ flex: 1 }}>
                  <ThemedText type="smallBold">Weekly Digests</ThemedText>
                  <ThemedText type="small" style={styles.toggleSubText}>
                    Email summaries of habits & productivity
                  </ThemedText>
                </View>
                <Switch
                  value={marketingEmails}
                  onValueChange={setMarketingEmails}
                  trackColor={{ true: '#5B7FFF', false: '#333' }}
                />
              </View>
            </ThemedView>
          </View>

          {/* Action Row */}
          <View style={{ gap: Spacing.two }}>
            {saveSuccess ? (
              <ThemedText style={styles.successText}>✓ Preferences updated successfully!</ThemedText>
            ) : null}

            <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isSaving}>
              {isSaving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText type="smallBold" style={styles.saveText}>
                  Save Settings
                </ThemedText>
              )}
            </TouchableOpacity>
          </View>
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
    gap: Spacing.four,
  },
  header: {
    gap: 2,
    marginBottom: Spacing.one,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  section: {
    gap: Spacing.two,
  },
  sectionHeader: {
    opacity: 0.6,
    textTransform: 'uppercase',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  themeRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  themeButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111',
  },
  themeButtonSelected: {
    borderColor: '#5B7FFF',
    backgroundColor: '#5B7FFF20',
  },
  themeButtonText: {
    color: '#999',
    fontSize: 13,
  },
  toggleCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#222',
    padding: Spacing.three,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.one,
  },
  toggleSubText: {
    opacity: 0.5,
    fontSize: 11,
    marginTop: 2,
  },
  toggleDivider: {
    height: 1,
    backgroundColor: '#222',
    marginVertical: Spacing.two,
  },
  saveButton: {
    height: 48,
    backgroundColor: '#5B7FFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.two,
  },
  saveText: {
    color: '#fff',
  },
  successText: {
    color: '#16C784',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 12,
  },
});
