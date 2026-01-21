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
import Button from '../../components/common/Button';
import { spacing } from '../../config/theme';
import { isValidEmail } from '../../utils/validators';

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
};

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { signIn, isLoading, error } = useAuth();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const diagonalAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Staggered entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(diagonalAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
    ]).start();

    // Subtle pulse animation for the basketball icon
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (validate()) {
      await signIn(email, password);
    }
  };

  const diagonalTranslate = diagonalAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, 0],
  });

  return (
    <View style={styles.container}>
      {/* Background with diagonal stripes */}
      <View style={styles.backgroundContainer}>
        {/* Primary diagonal stripe */}
        <Animated.View
          style={[
            styles.diagonalStripe,
            styles.diagonalStripe1,
            { transform: [{ translateX: diagonalTranslate }] },
          ]}
        />
        {/* Secondary diagonal stripe */}
        <Animated.View
          style={[
            styles.diagonalStripe,
            styles.diagonalStripe2,
            {
              transform: [{ translateX: diagonalTranslate }],
              opacity: diagonalAnim,
            },
          ]}
        />
        {/* Court texture overlay */}
        <View style={styles.courtTexture} />
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
            {/* Logo / Basketball Icon */}
            <Animated.View
              style={[
                styles.logoContainer,
                {
                  transform: [{ scale: Animated.multiply(logoScale, pulseAnim) }],
                },
              ]}
            >
              <View style={styles.basketballIcon}>
                <View style={styles.basketballLine1} />
                <View style={styles.basketballLine2} />
                <View style={styles.basketballLine3} />
              </View>
            </Animated.View>

            {/* Title */}
            <Text style={styles.title}>WELCOME{'\n'}BACK</Text>
            <Text style={styles.subtitle}>Sign in to track your game</Text>

            {/* Form */}
            <View style={styles.form}>
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

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>PASSWORD</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  mode="flat"
                  secureTextEntry
                  placeholder="Enter your password"
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

              {error && (
                <View style={styles.apiErrorContainer}>
                  <Text style={styles.apiErrorText}>{error}</Text>
                </View>
              )}

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.signInButton, isLoading && styles.signInButtonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                <View style={styles.buttonGradient}>
                  <Text style={styles.signInButtonText}>
                    {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
                  </Text>
                  {!isLoading && (
                    <View style={styles.buttonArrow}>
                      <Text style={styles.buttonArrowText}>→</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.signUpLink}>Sign Up</Text>
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
    height: height * 0.6,
    backgroundColor: courtColors.courtOrange,
    transform: [{ rotate: '-15deg' }],
  },
  diagonalStripe1: {
    top: -height * 0.35,
    left: -width * 0.5,
    opacity: 0.08,
  },
  diagonalStripe2: {
    top: -height * 0.25,
    left: -width * 0.3,
    opacity: 0.04,
  },
  courtTexture: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: courtColors.courtLine,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  basketballIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: courtColors.courtOrange,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
  },
  basketballLine1: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: courtColors.courtOrange,
  },
  basketballLine2: {
    position: 'absolute',
    width: 2,
    height: '100%',
    backgroundColor: courtColors.courtOrange,
  },
  basketballLine3: {
    position: 'absolute',
    width: '140%',
    height: 2,
    backgroundColor: courtColors.courtOrange,
    transform: [{ rotate: '45deg' }],
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: courtColors.white,
    letterSpacing: 2,
    lineHeight: 48,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: courtColors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.xl,
    letterSpacing: 0.5,
  },
  form: {
    width: '100%',
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgotPasswordText: {
    color: courtColors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  signInButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: spacing.sm,
  },
  signInButtonDisabled: {
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
  signInButtonText: {
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
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  signUpText: {
    color: courtColors.textMuted,
    fontSize: 15,
  },
  signUpLink: {
    color: courtColors.courtOrange,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default LoginScreen;
