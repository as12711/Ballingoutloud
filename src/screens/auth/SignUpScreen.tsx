import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Dimensions,
  TouchableOpacity,
  Easing,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useAuth } from '../../hooks/useAuth';
import { isValidEmail, isValidPassword } from '../../utils/validators';
import { UserRole } from '../../types/user';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { H2 } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

const { width, height } = Dimensions.get('window');

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
    <View className="flex-1 bg-background">
      {/* Background */}
      <View className="absolute inset-0 overflow-hidden">
        <View
          className="absolute bg-primary opacity-[0.06]"
          style={{
            width: width * 2,
            height: height * 0.5,
            top: -height * 0.4,
            left: -width * 0.5,
            transform: [{ rotate: '-15deg' }],
          }}
        />
        <View
          className="absolute bg-primary opacity-[0.03]"
          style={{
            width: width * 2,
            height: height * 0.5,
            top: -height * 0.32,
            left: -width * 0.3,
            transform: [{ rotate: '-15deg' }],
          }}
        />
      </View>

      {/* Header */}
      <View
        className="flex-row items-center px-6 pb-4"
        style={{ paddingTop: Platform.OS === 'ios' ? 60 : 40 }}
      >
        <TouchableOpacity
          className="w-11 h-11 rounded-full bg-foreground/[0.08] justify-center items-center mr-4"
          onPress={handleBack}
        >
          <Text className="text-foreground text-2xl font-light">←</Text>
        </TouchableOpacity>
        <View className="flex-1">
          <View className="h-1 bg-foreground/10 rounded-full overflow-hidden mb-1">
            <Animated.View
              className="h-full bg-primary rounded-full"
              style={{
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              }}
            />
          </View>
          <Text className="text-muted-foreground text-xs font-semibold tracking-wider">
            Step {step} of 2
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="px-6 pb-12"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            className="w-full max-w-[400px] self-center"
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {step === 1 ? (
              <Animated.View
                className="w-full"
                style={{
                  opacity: stepOpacity,
                  transform: [{ translateY: stepTranslate }],
                }}
              >
                <H2 className="text-[38px] font-black text-foreground tracking-widest leading-[44px] mb-2 border-b-0">
                  {'CREATE\nACCOUNT'}
                </H2>
                <Text className="text-base text-muted-foreground mb-8 tracking-wide">
                  Join the court today
                </Text>

                <View className="w-full gap-6">
                  <View>
                    <Text className="text-[11px] font-bold text-primary tracking-[2px] mb-1">
                      FULL NAME
                    </Text>
                    <Input
                      value={fullName}
                      onChangeText={setFullName}
                      placeholder="John Smith"
                      className={cn(
                        'bg-transparent border-0 border-b-2 rounded-none px-0 h-12 text-base text-foreground',
                        errors.fullName ? 'border-b-destructive' : 'border-b-border'
                      )}
                    />
                    {errors.fullName && (
                      <Text className="text-destructive text-xs mt-1 font-medium">{errors.fullName}</Text>
                    )}
                  </View>

                  <View>
                    <Text className="text-[11px] font-bold text-primary tracking-[2px] mb-1">
                      EMAIL
                    </Text>
                    <Input
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholder="your@email.com"
                      className={cn(
                        'bg-transparent border-0 border-b-2 rounded-none px-0 h-12 text-base text-foreground',
                        errors.email ? 'border-b-destructive' : 'border-b-border'
                      )}
                    />
                    {errors.email && (
                      <Text className="text-destructive text-xs mt-1 font-medium">{errors.email}</Text>
                    )}
                  </View>

                  <View className="flex-row gap-4">
                    <View className="flex-1">
                      <Text className="text-[11px] font-bold text-primary tracking-[2px] mb-1">
                        PASSWORD
                      </Text>
                      <Input
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholder="••••••••"
                        className={cn(
                          'bg-transparent border-0 border-b-2 rounded-none px-0 h-12 text-base text-foreground',
                          errors.password ? 'border-b-destructive' : 'border-b-border'
                        )}
                      />
                      {errors.password && (
                        <Text className="text-destructive text-xs mt-1 font-medium">{errors.password}</Text>
                      )}
                    </View>

                    <View className="flex-1">
                      <Text className="text-[11px] font-bold text-primary tracking-[2px] mb-1">
                        CONFIRM
                      </Text>
                      <Input
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        placeholder="••••••••"
                        className={cn(
                          'bg-transparent border-0 border-b-2 rounded-none px-0 h-12 text-base text-foreground',
                          errors.confirmPassword ? 'border-b-destructive' : 'border-b-border'
                        )}
                      />
                      {errors.confirmPassword && (
                        <Text className="text-destructive text-xs mt-1 font-medium">{errors.confirmPassword}</Text>
                      )}
                    </View>
                  </View>

                  <Button
                    onPress={handleContinue}
                    size="lg"
                    className="rounded-xl h-14 mt-4"
                  >
                    <Text className="text-primary-foreground text-base font-extrabold tracking-[2px]">
                      CONTINUE
                    </Text>
                    <View className="ml-2 bg-white/20 rounded-xl w-6 h-6 justify-center items-center">
                      <Text className="text-primary-foreground text-base font-semibold">→</Text>
                    </View>
                  </Button>
                </View>
              </Animated.View>
            ) : (
              <Animated.View
                className="w-full"
                style={{
                  opacity: stepOpacity,
                  transform: [{ translateY: stepTranslate }],
                }}
              >
                <H2 className="text-[38px] font-black text-foreground tracking-widest leading-[44px] mb-2 border-b-0">
                  {'SELECT\nYOUR ROLE'}
                </H2>
                <Text className="text-base text-muted-foreground mb-8 tracking-wide">
                  How will you use Balling Out Loud?
                </Text>

                <View className="mb-6 gap-3">
                  {roleOptions.map((role) => (
                    <TouchableOpacity
                      key={role.value}
                      className={cn(
                        'flex-row items-center rounded-2xl p-4 border-2',
                        selectedRole === role.value
                          ? 'bg-primary/10 border-primary'
                          : 'bg-foreground/[0.04] border-transparent'
                      )}
                      onPress={() => setSelectedRole(role.value)}
                      activeOpacity={0.8}
                    >
                      <View className="w-[50px] h-[50px] rounded-xl bg-foreground/[0.06] justify-center items-center mr-4">
                        <Text className="text-2xl">{role.icon}</Text>
                      </View>
                      <View className="flex-1">
                        <Text
                          className={cn(
                            'text-base font-bold mb-0.5',
                            selectedRole === role.value ? 'text-primary' : 'text-foreground'
                          )}
                        >
                          {role.label}
                        </Text>
                        <Text className="text-[13px] text-muted-foreground">{role.description}</Text>
                      </View>
                      <View
                        className={cn(
                          'w-6 h-6 rounded-full border-2 justify-center items-center',
                          selectedRole === role.value ? 'border-primary' : 'border-border'
                        )}
                      >
                        {selectedRole === role.value && (
                          <View className="w-3 h-3 rounded-full bg-primary" />
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>

                {errors.role && (
                  <Text className="text-destructive text-sm mb-4 font-medium text-center">{errors.role}</Text>
                )}
                {error && (
                  <View className="bg-destructive/15 rounded-lg p-4 mb-4 border-l-[3px] border-l-destructive">
                    <Text className="text-destructive text-sm font-medium">{error}</Text>
                  </View>
                )}

                <Button
                  onPress={handleSignUp}
                  disabled={isLoading}
                  size="lg"
                  className="rounded-xl h-14 mt-4"
                >
                  <Text className="text-primary-foreground text-base font-extrabold tracking-[2px]">
                    {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                  </Text>
                  {!isLoading && (
                    <View className="ml-2 bg-white/20 rounded-xl w-6 h-6 justify-center items-center">
                      <Text className="text-primary-foreground text-base font-semibold">→</Text>
                    </View>
                  )}
                </Button>
              </Animated.View>
            )}

            {/* Sign In Link */}
            <View className="flex-row justify-center mt-8">
              <Text className="text-muted-foreground text-[15px]">Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text className="text-primary text-[15px] font-bold tracking-wide">Sign In</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignUpScreen;
