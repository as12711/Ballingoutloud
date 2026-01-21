import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Dimensions,
  TouchableOpacity,
  Easing,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useAuth } from '../../hooks/useAuth';
import { spacing } from '../../config/theme';
import { isValidEmail, isValidPassword } from '../../utils/validators';
import { UserRole } from '../../types/user';

const { width, height } = Dimensions.get('window');

// Court Vision Design System
const courtColors = {
  deepNavy: '#0A1929',
  courtOrange: '#FF6B35',
  courtOrangeLight: '#FF8A5B',
  courtOrangeDark: '#E55A25',
  white: '#FFFFFF',
  offWhite: '#F8F9FA',
  textMuted: '#6B7280',
  courtLine: 'rgba(255, 107, 53, 0.15)',
  inputBg: 'rgba(255, 255, 255, 0.08)',
  inputBorder: 'rgba(255, 255, 255, 0.12)',
  error: '#EF4444',
  success: '#10B981',
};

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

interface RoleOption {
  value: UserRole;
  label: string;
  icon: string;
  description: string;
}

const roleOptions: RoleOption[] = [
  { value: UserRole.COACH, label: 'Coach', icon: '📋', description: 'Track stats & manage teams' },
  { value: UserRole.PLAYER, label: 'Player', icon: '🏀', description: 'View your performance' },
  { value: UserRole.PARENT, label: 'Parent', icon: '👨‍👩‍👧', description: 'Follow your athlete' },
  { value: UserRole.FAN, label: 'Fan', icon: '🎉', description: 'Watch live games' },
];

const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    role?: string;
  }>({});
  const { signUp, isLoading, error } = useAuth();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const progressAnim = useRef(new Animated.Value(0.5)).current;
  const stepTransition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, []);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: step === 1 ? 0.5 : 1,
      duration: 300,
      useNativeDriver: false,
      easing: Easing.out(Easing.cubic),
    }).start();

    // Step transition animation
    stepTransition.setValue(0);
    Animated.timing(stepTransition, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
  }, [step]);

  const validateStep1 = () => {
    const newErrors: typeof errors = {};
    if (!fullName.trim()) {
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

  const validateStep2 = () => {
    const newErrors: typeof errors = {};
    if (!selectedRole) {
      newErrors.role = 'Please select your role';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSignUp = async () => {
    if (validateStep2()) {
      await signUp(email, password, fullName);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      navigation.goBack();
    }
  };

  const stepOpacity = stepTransition.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const stepTranslate = stepTransition.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  return (
    <View style={styles.container}>
      {/* Background */}
      <View style={styles.backgroundContainer}>
        <View style={[styles.diagonalStripe, styles.diagonalStripe1]} />
        <View style={[styles.diagonalStripe, styles.diagonalStripe2]} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                { width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }) },
              ]}
            />
          </View>
          <Text style={styles.progressText}>Step {step} of 2</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {step === 1 ? (
              <Animated.View
                style={[
                  styles.stepContainer,
                  {
                    opacity: stepOpacity,
                    transform: [{ translateY: stepTranslate }],
                  },
                ]}
              >
                <Text style={styles.title}>CREATE{'\n'}ACCOUNT</Text>
                <Text style={styles.subtitle}>Join the court today</Text>

                <View style={styles.form}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>FULL NAME</Text>
                    <TextInput
                      value={fullName}
                      onChangeText={setFullName}
                      mode="flat"
                      placeholder="John Smith"
                      placeholderTextColor={courtColors.textMuted}
                      error={!!errors.fullName}
                      style={styles.input}
                      textColor={courtColors.white}
                      underlineColor="transparent"
                      activeUnderlineColor={courtColors.courtOrange}
                      theme={{
                        colors: {
                          background: 'transparent',
                          placeholder: courtColors.textMuted,
                        },
                      }}
                    />
                    <View style={[styles.inputUnderline, errors.fullName && styles.inputUnderlineError]} />
                    {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>EMAIL</Text>
                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      mode="flat"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholder="your@email.com"
                      placeholderTextColor={courtColors.textMuted}
                      error={!!errors.email}
                      style={styles.input}
                      textColor={courtColors.white}
                      underlineColor="transparent"
                      activeUnderlineColor={courtColors.courtOrange}
                      theme={{
                        colors: {
                          background: 'transparent',
                          placeholder: courtColors.textMuted,
                        },
                      }}
                    />
                    <View style={[styles.inputUnderline, errors.email && styles.inputUnderlineError]} />
                    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                  </View>

                  <View style={styles.row}>
                    <View style={[styles.inputContainer, styles.halfInput]}>
                      <Text style={styles.inputLabel}>PASSWORD</Text>
                      <TextInput
                        value={password}
                        onChangeText={setPassword}
                        mode="flat"
                        secureTextEntry
                        placeholder="••••••••"
                        placeholderTextColor={courtColors.textMuted}
                        error={!!errors.password}
                        style={styles.input}
                        textColor={courtColors.white}
                        underlineColor="transparent"
                        activeUnderlineColor={courtColors.courtOrange}
                        theme={{
                          colors: {
                            background: 'transparent',
                            placeholder: courtColors.textMuted,
                          },
                        }}
                      />
                      <View style={[styles.inputUnderline, errors.password && styles.inputUnderlineError]} />
                      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                    </View>

                    <View style={[styles.inputContainer, styles.halfInput]}>
                      <Text style={styles.inputLabel}>CONFIRM</Text>
                      <TextInput
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        mode="flat"
                        secureTextEntry
                        placeholder="••••••••"
                        placeholderTextColor={courtColors.textMuted}
                        error={!!errors.confirmPassword}
                        style={styles.input}
                        textColor={courtColors.white}
                        underlineColor="transparent"
                        activeUnderlineColor={courtColors.courtOrange}
                        theme={{
                          colors: {
                            background: 'transparent',
                            placeholder: courtColors.textMuted,
                          },
                        }}
                      />
                      <View style={[styles.inputUnderline, errors.confirmPassword && styles.inputUnderlineError]} />
                      {errors.confirmPassword && (
                        <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                      )}
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.continueButton}
                    onPress={handleContinue}
                    activeOpacity={0.85}
                  >
                    <View style={styles.buttonGradient}>
                      <Text style={styles.continueButtonText}>CONTINUE</Text>
                      <View style={styles.buttonArrow}>
                        <Text style={styles.buttonArrowText}>→</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ) : (
              <Animated.View
                style={[
                  styles.stepContainer,
                  {
                    opacity: stepOpacity,
                    transform: [{ translateY: stepTranslate }],
                  },
                ]}
              >
                <Text style={styles.title}>SELECT{'\n'}YOUR ROLE</Text>
                <Text style={styles.subtitle}>How will you use Balling Out Loud?</Text>

                <View style={styles.rolesContainer}>
                  {roleOptions.map((role, index) => (
                    <TouchableOpacity
                      key={role.value}
                      style={[
                        styles.roleCard,
                        selectedRole === role.value && styles.roleCardSelected,
                      ]}
                      onPress={() => setSelectedRole(role.value)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.roleIconContainer}>
                        <Text style={styles.roleIcon}>{role.icon}</Text>
                      </View>
                      <View style={styles.roleInfo}>
                        <Text style={[
                          styles.roleLabel,
                          selectedRole === role.value && styles.roleLabelSelected,
                        ]}>
                          {role.label}
                        </Text>
                        <Text style={styles.roleDescription}>{role.description}</Text>
                      </View>
                      <View style={[
                        styles.roleRadio,
                        selectedRole === role.value && styles.roleRadioSelected,
                      ]}>
                        {selectedRole === role.value && (
                          <View style={styles.roleRadioInner} />
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>

                {errors.role && <Text style={styles.errorTextCenter}>{errors.role}</Text>}
                {error && (
                  <View style={styles.apiErrorContainer}>
                    <Text style={styles.apiErrorText}>{error}</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.continueButton, isLoading && styles.continueButtonDisabled]}
                  onPress={handleSignUp}
                  disabled={isLoading}
                  activeOpacity={0.85}
                >
                  <View style={styles.buttonGradient}>
                    <Text style={styles.continueButtonText}>
                      {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                    </Text>
                    {!isLoading && (
                      <View style={styles.buttonArrow}>
                        <Text style={styles.buttonArrowText}>→</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </Animated.View>
            )}

            {/* Sign In Link */}
            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: courtColors.deepNavy,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  diagonalStripe: {
    position: 'absolute',
    width: width * 2,
    height: height * 0.5,
    backgroundColor: courtColors.courtOrange,
    transform: [{ rotate: '-15deg' }],
  },
  diagonalStripe1: {
    top: -height * 0.4,
    left: -width * 0.5,
    opacity: 0.06,
  },
  diagonalStripe2: {
    top: -height * 0.32,
    left: -width * 0.3,
    opacity: 0.03,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  backButtonText: {
    color: courtColors.white,
    fontSize: 24,
    fontWeight: '300',
  },
  progressContainer: {
    flex: 1,
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: courtColors.courtOrange,
    borderRadius: 2,
  },
  progressText: {
    color: courtColors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  stepContainer: {
    width: '100%',
  },
  title: {
    fontSize: 38,
    fontWeight: '900',
    color: courtColors.white,
    letterSpacing: 2,
    lineHeight: 44,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: courtColors.textMuted,
    marginBottom: spacing.xl,
    letterSpacing: 0.5,
  },
  form: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: courtColors.courtOrange,
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: 'transparent',
    fontSize: 16,
    paddingHorizontal: 0,
    height: 48,
  },
  inputUnderline: {
    height: 2,
    backgroundColor: courtColors.inputBorder,
    marginTop: -8,
  },
  inputUnderlineError: {
    backgroundColor: courtColors.error,
  },
  errorText: {
    color: courtColors.error,
    fontSize: 12,
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  errorTextCenter: {
    color: courtColors.error,
    fontSize: 14,
    marginBottom: spacing.md,
    fontWeight: '500',
    textAlign: 'center',
  },
  apiErrorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: courtColors.error,
  },
  apiErrorText: {
    color: courtColors.error,
    fontSize: 14,
    fontWeight: '500',
  },
  rolesContainer: {
    marginBottom: spacing.lg,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  roleCardSelected: {
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderColor: courtColors.courtOrange,
  },
  roleIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  roleIcon: {
    fontSize: 24,
  },
  roleInfo: {
    flex: 1,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: courtColors.white,
    marginBottom: 2,
  },
  roleLabelSelected: {
    color: courtColors.courtOrange,
  },
  roleDescription: {
    fontSize: 13,
    color: courtColors.textMuted,
  },
  roleRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: courtColors.inputBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleRadioSelected: {
    borderColor: courtColors.courtOrange,
  },
  roleRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: courtColors.courtOrange,
  },
  continueButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: spacing.md,
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    backgroundColor: courtColors.courtOrange,
    paddingVertical: 18,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    color: courtColors.white,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
  },
  buttonArrow: {
    marginLeft: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonArrowText: {
    color: courtColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  signInText: {
    color: courtColors.textMuted,
    fontSize: 15,
  },
  signInLink: {
    color: courtColors.courtOrange,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default SignUpScreen;
