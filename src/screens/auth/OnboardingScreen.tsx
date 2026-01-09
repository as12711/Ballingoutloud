import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import Button from '../../components/common/Button';
import { theme, spacing } from '../../config/theme';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Balling Out Loud</Text>
        <Text style={styles.subtitle}>Track. Analyze. Excel.</Text>
        <Text style={styles.description}>
          Professional-grade statistics tracking for high school sports
        </Text>
      </View>

      <View style={styles.buttons}>
        <Button
          title="Sign In"
          onPress={() => navigation.navigate('Login')}
          fullWidth
          style={styles.button}
        />
        <Button
          title="Sign Up"
          onPress={() => navigation.navigate('SignUp')}
          variant="outline"
          fullWidth
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  buttons: {
    width: '100%',
  },
  button: {
    marginBottom: spacing.md,
  },
});

export default OnboardingScreen;
