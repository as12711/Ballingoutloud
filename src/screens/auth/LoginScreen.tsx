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
import { isValidEmail } from '../../utils/validators';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { H2 } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

const { width, height } = Dimensions.get('window');

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
    <View className="flex-1 bg-background">
      {/* Background with diagonal stripes */}
      <View className="absolute inset-0 overflow-hidden">
        {/* Primary diagonal stripe */}
        <Animated.View
          className="absolute bg-primary opacity-[0.08]"
          style={{
            width: width * 2,
            height: height * 0.6,
            top: -height * 0.35,
            left: -width * 0.5,
            transform: [{ rotate: '-15deg' }, { translateX: diagonalTranslate }],
          }}
        />
        {/* Secondary diagonal stripe */}
        <Animated.View
          className="absolute bg-primary opacity-[0.04]"
          style={{
            width: width * 2,
            height: height * 0.6,
            top: -height * 0.25,
            left: -width * 0.3,
            transform: [{ rotate: '-15deg' }, { translateX: diagonalTranslate }],
            opacity: diagonalAnim,
          }}
        />
        {/* Court texture overlay */}
        <View className="absolute inset-0 border border-primary/15" />
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          className="px-6 py-12"
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
            {/* Logo / Basketball Icon */}
            <Animated.View
              className="items-center mb-8"
              style={{
                transform: [{ scale: Animated.multiply(logoScale, pulseAnim) }],
              }}
            >
              <View className="w-20 h-20 rounded-full border-[3px] border-primary justify-center items-center overflow-hidden bg-primary/10">
                <View className="absolute w-full h-[2px] bg-primary" />
                <View className="absolute w-[2px] h-full bg-primary" />
                <View className="absolute w-[140%] h-[2px] bg-primary rotate-45" />
              </View>
            </Animated.View>

            {/* Title */}
            <H2 className="text-[42px] font-black text-foreground tracking-widest leading-[48px] text-center mb-2 border-b-0">
              {'WELCOME\nBACK'}
            </H2>
            <Text className="text-base text-muted-foreground text-center mb-8 tracking-wide">
              Sign in to track your game
            </Text>

            {/* Form */}
            <View className="w-full gap-6">
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

              <View>
                <Text className="text-[11px] font-bold text-primary tracking-[2px] mb-1">
                  PASSWORD
                </Text>
                <Input
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholder="Enter your password"
                  className={cn(
                    'bg-transparent border-0 border-b-2 rounded-none px-0 h-12 text-base text-foreground',
                    errors.password ? 'border-b-destructive' : 'border-b-border'
                  )}
                />
                {errors.password && (
                  <Text className="text-destructive text-xs mt-1 font-medium">{errors.password}</Text>
                )}
              </View>

              {error && (
                <View className="bg-destructive/15 rounded-lg p-4 border-l-[3px] border-l-destructive">
                  <Text className="text-destructive text-sm font-medium">{error}</Text>
                </View>
              )}

              <TouchableOpacity className="self-end">
                <Text className="text-muted-foreground text-sm font-medium">Forgot password?</Text>
              </TouchableOpacity>

              <Button
                onPress={handleLogin}
                disabled={isLoading}
                size="lg"
                className="rounded-xl h-14 mt-2"
              >
                <Text className="text-primary-foreground text-base font-extrabold tracking-[2px]">
                  {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
                </Text>
                {!isLoading && (
                  <View className="ml-2 bg-white/20 rounded-xl w-6 h-6 justify-center items-center">
                    <Text className="text-primary-foreground text-base font-semibold">→</Text>
                  </View>
                )}
              </Button>
            </View>

            {/* Sign Up Link */}
            <View className="flex-row justify-center mt-8">
              <Text className="text-muted-foreground text-[15px]">Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text className="text-primary text-[15px] font-bold tracking-wide">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;
