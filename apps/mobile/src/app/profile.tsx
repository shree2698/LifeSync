import * as React from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuthStore } from '@lifesync/hooks';
import { Spacing, BottomTabInset, MaxContentWidth } from '@/constants/theme';

export default function MobileProfileScreen() {
  const { user, profile, updateProfile, logout } = useAuthStore();
  const [fullName, setFullName] = React.useState(profile?.fullName || '');
  const [avatar, setAvatar] = React.useState(profile?.avatar || '');
  const [timezone, setTimezone] = React.useState(profile?.timezone || 'UTC');
  const [country, setCountry] = React.useState(profile?.country || '');
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const handleSave = async () => {
    if (!fullName) return;
    setIsSubmitting(true);
    setSaveSuccess(false);

    const success = await updateProfile({
      fullName,
      avatar: avatar || null,
      timezone,
      country: country || null,
    });

    setIsSubmitting(false);
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText type="title" style={styles.titleText}>
              Your Profile
            </ThemedText>
            <ThemedText type="small" style={{ opacity: 0.6 }}>
              Manage your personal public identity credentials
            </ThemedText>
          </View>

          {/* Avatar Overview Card */}
          <ThemedView type="backgroundElement" style={styles.profileOverview}>
            <Image
              source={{
                uri:
                  avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              }}
              style={styles.avatarImage}
            />
            <ThemedText type="smallBold" style={styles.displayName}>
              {profile?.fullName || 'LifeSync User'}
            </ThemedText>
            <ThemedText type="small" style={styles.emailText}>
              {user?.email}
            </ThemedText>
          </ThemedView>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <ThemedText type="smallBold" style={styles.label}>
                Full Name
              </ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#666"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText type="smallBold" style={styles.label}>
                Avatar URL
              </ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Image URL"
                placeholderTextColor="#666"
                value={avatar}
                onChangeText={setAvatar}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText type="smallBold" style={styles.label}>
                Timezone
              </ThemedText>
              <TextInput
                style={styles.input}
                placeholder="UTC"
                placeholderTextColor="#666"
                value={timezone}
                onChangeText={setTimezone}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText type="smallBold" style={styles.label}>
                Country
              </ThemedText>
              <TextInput
                style={styles.input}
                placeholder="United States"
                placeholderTextColor="#666"
                value={country}
                onChangeText={setCountry}
              />
            </View>

            {saveSuccess ? (
              <ThemedText style={styles.successText}>✓ Profile updated successfully!</ThemedText>
            ) : null}

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={isSubmitting}>
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText type="smallBold" style={styles.saveText}>
                  Save Changes
                </ThemedText>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <ThemedText type="smallBold" style={styles.logoutText}>
                Logout
              </ThemedText>
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
  profileOverview: {
    borderRadius: 16,
    padding: Spacing.four,
    alignItems: 'center',
    gap: Spacing.two,
    borderWidth: 1,
    borderColor: '#222',
  },
  avatarImage: {
    height: 72,
    width: 72,
    borderRadius: 36,
    backgroundColor: '#333',
  },
  displayName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: Spacing.one,
  },
  emailText: {
    opacity: 0.6,
    fontSize: 12,
  },
  form: {
    gap: Spacing.three,
  },
  inputGroup: {
    gap: Spacing.one,
  },
  label: {
    opacity: 0.8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    fontSize: 14,
    color: '#fff',
    backgroundColor: '#111',
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
  logoutButton: {
    height: 48,
    borderWidth: 1,
    borderColor: '#EF444430',
    backgroundColor: '#EF444410',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.one,
  },
  logoutText: {
    color: '#EF4444',
  },
  successText: {
    color: '#16C784',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 12,
  },
});
