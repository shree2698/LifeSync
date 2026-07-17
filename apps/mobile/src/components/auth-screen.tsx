import * as React from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { useAuthStore } from '@lifesync/hooks';
import { Spacing } from '@/constants/theme';

export function AuthScreen() {
  const { login, register: registerUser, isLoading, error } = useAuthStore();
  const [isRegister, setIsRegister] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [validationError, setValidationError] = React.useState('');

  const handleAction = async () => {
    setValidationError('');
    if (!email) {
      setValidationError('Email is required');
      return;
    }
    if (isRegister && !fullName) {
      setValidationError('Full name is required');
      return;
    }

    if (isRegister) {
      await registerUser(email, fullName);
    } else {
      await login(email);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            LifeSync
          </ThemedText>
          <ThemedText type="small" style={styles.subtitle}>
            {isRegister
              ? 'Create a new Life Operating System account'
              : 'Sign in to access your dashboard'}
          </ThemedText>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {isRegister && (
            <View style={styles.inputGroup}>
              <ThemedText type="smallBold" style={styles.label}>
                Full Name
              </ThemedText>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor="#666"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <ThemedText type="smallBold" style={styles.label}>
              Email Address
            </ThemedText>
            <TextInput
              style={styles.input}
              placeholder="john@example.com"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText type="smallBold" style={styles.label}>
              Password
            </ThemedText>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#666"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />
          </View>

          {validationError ? (
            <ThemedText style={styles.errorText}>{validationError}</ThemedText>
          ) : null}

          {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleAction}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText type="smallBold" style={styles.submitText}>
                {isRegister ? 'Sign Up' : 'Sign In'}
              </ThemedText>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer Toggle */}
        <TouchableOpacity
          style={styles.toggleContainer}
          onPress={() => {
            setIsRegister(!isRegister);
            setValidationError('');
          }}>
          <ThemedText type="small" style={styles.toggleText}>
            {isRegister ? 'Already have an account? Sign In' : 'New to LifeSync? Sign Up'}
          </ThemedText>
        </TouchableOpacity>

        {/* OAuth Placeholders */}
        <View style={styles.oauthContainer}>
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <ThemedText type="small" style={styles.dividerText}>
              OR CONTINUE WITH
            </ThemedText>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.oauthRow}>
            <TouchableOpacity
              style={styles.oauthButton}
              onPress={() => login('demo.google@souree.com')}>
              <ThemedText type="smallBold" style={styles.oauthButtonText}>
                Google
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.oauthButton}
              onPress={() => login('demo.apple@souree.com')}>
              <ThemedText type="smallBold" style={styles.oauthButtonText}>
                 Apple
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  innerContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    gap: Spacing.four,
  },
  header: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
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
  submitButton: {
    height: 48,
    backgroundColor: '#5B7FFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.two,
  },
  submitText: {
    color: '#fff',
    fontSize: 15,
  },
  toggleContainer: {
    alignItems: 'center',
  },
  toggleText: {
    color: '#5B7FFF',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  oauthContainer: {
    marginTop: Spacing.three,
    gap: Spacing.three,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#222',
  },
  dividerText: {
    fontSize: 10,
    opacity: 0.5,
    letterSpacing: 1,
  },
  oauthRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  oauthButton: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#222',
    backgroundColor: '#0c0c0c',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  oauthButtonText: {
    fontSize: 13,
  },
});
