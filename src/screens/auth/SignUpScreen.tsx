import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import { theme, spacing } from '../../config/theme';
import { isValidEmail, isValidPassword } from '../../utils/validators';

const SignUpScreen: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const { signUp, isLoading, error } = useAuth();

  const validate = () => {
    const newErrors: {
      fullName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    if (!fullName) {
      newErrors.fullName = 'Full name is required';
    }
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!isValidPassword(password)) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (validate()) {
      await signUp(email, password, fullName);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>

          <View style={styles.form}>
            <TextInput
              label="Full Name"
              value={fullName}
              onChangeText={setFullName}
              mode="outlined"
              error={!!errors.fullName}
              style={styles.input}
            />
            {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              error={!!errors.email}
              style={styles.input}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry
              error={!!errors.password}
              style={styles.input}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              secureTextEntry
              error={!!errors.confirmPassword}
              style={styles.input}
            />
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Button
              title="Sign Up"
              onPress={handleSignUp}
              loading={isLoading}
              fullWidth
              style={styles.button}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  content: {
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: spacing.sm,
    backgroundColor: theme.colors.background,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  button: {
    marginTop: spacing.md,
  },
});

export default SignUpScreen;
