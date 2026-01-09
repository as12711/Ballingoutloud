import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import { theme, spacing } from '../../config/theme';

const ProfileScreen: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>
        {user && (
          <View style={styles.userInfo}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{user.full_name}</Text>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user.email}</Text>
            <Text style={styles.label}>Role:</Text>
            <Text style={styles.value}>{user.role}</Text>
          </View>
        )}
        <Button title="Sign Out" onPress={() => signOut()} fullWidth style={styles.button} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: spacing.lg,
  },
  userInfo: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginTop: spacing.sm,
  },
  value: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: spacing.xs,
  },
  button: {
    marginTop: spacing.md,
  },
});

export default ProfileScreen;
