import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  Platform,
  Easing,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { spacing } from '../../config/theme';

const { width, height } = Dimensions.get('window');

// Court Vision Design System
const courtColors = {
  deepNavy: '#0A1929',
  midNavy: '#0D2137',
  courtOrange: '#FF6B35',
  courtOrangeLight: '#FF8A5B',
  white: '#FFFFFF',
  textMuted: '#6B7280',
  courtLine: 'rgba(255, 107, 53, 0.2)',
};

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  accentColor: string;
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'TRACK',
    subtitle: 'LIVE STATS',
    description: 'Professional-grade basketball statistics tracking during live games',
    icon: '📊',
    accentColor: '#FF6B35',
  },
  {
    id: '2',
    title: 'ANALYZE',
    subtitle: 'PERFORMANCE',
    description: 'Detailed box scores, player analytics, and team insights at your fingertips',
    icon: '📈',
    accentColor: '#10B981',
  },
  {
    id: '3',
    title: 'DOMINATE',
    subtitle: 'THE COURT',
    description: 'Make data-driven decisions to elevate your game to championship level',
    icon: '🏆',
    accentColor: '#F59E0B',
  },
];

const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(50)).current;
  const courtLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]),
      Animated.timing(contentSlide, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();

    // Court line drawing animation
    Animated.timing(courtLineAnim, {
      toValue: 1,
      duration: 1500,
      delay: 300,
      useNativeDriver: false,
      easing: Easing.out(Easing.cubic),
    }).start();
  }, []);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const goToSlide = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setCurrentIndex(index);
  };

  const rotateInterpolation = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderSlide = ({ item, index }: { item: OnboardingSlide; index: number }) => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.4, 1, 0.4],
      extrapolate: 'clamp',
    });

    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [30, 0, 30],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.slide}>
        <Animated.View
          style={[
            styles.slideContent,
            {
              opacity,
              transform: [{ scale }, { translateY }],
            },
          ]}
        >
          {/* Large Icon */}
          <View style={[styles.iconContainer, { backgroundColor: `${item.accentColor}20` }]}>
            <Text style={styles.slideIcon}>{item.icon}</Text>
            <View style={[styles.iconGlow, { backgroundColor: item.accentColor }]} />
          </View>

          {/* Title */}
          <Text style={styles.slideTitle}>{item.title}</Text>
          <Text style={[styles.slideSubtitle, { color: item.accentColor }]}>
            {item.subtitle}
          </Text>
          <Text style={styles.slideDescription}>{item.description}</Text>
        </Animated.View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Background Elements */}
      <View style={styles.backgroundContainer}>
        {/* Diagonal court lines */}
        <Animated.View
          style={[
            styles.courtLine,
            styles.courtLine1,
            {
              width: courtLineAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '200%'],
              }),
            },
          ]}
        />
        <Animated.View
          style={[
            styles.courtLine,
            styles.courtLine2,
            {
              width: courtLineAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '200%'],
              }),
            },
          ]}
        />
        <Animated.View
          style={[
            styles.courtLine,
            styles.courtLine3,
            {
              width: courtLineAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '150%'],
              }),
            },
          ]}
        />

        {/* Center court circle */}
        <Animated.View
          style={[
            styles.centerCourt,
            {
              opacity: courtLineAnim,
              transform: [
                {
                  scale: courtLineAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
              ],
            },
          ]}
        />
      </View>

      {/* Header with Logo */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.logoContainer,
            { transform: [{ rotate: rotateInterpolation }] },
          ]}
        >
          <View style={styles.basketballLogo}>
            <View style={styles.ballLine1} />
            <View style={styles.ballLine2} />
            <View style={styles.ballLine3} />
          </View>
        </Animated.View>
        <Text style={styles.appName}>BALLING OUT LOUD</Text>
        <Text style={styles.tagline}>Track. Analyze. Excel.</Text>
      </Animated.View>

      {/* Slides */}
      <Animated.View
        style={[
          styles.slidesContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: contentSlide }],
          },
        ]}
      >
        <FlatList
          ref={flatListRef}
          data={slides}
          renderItem={renderSlide}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          scrollEventThrottle={16}
          bounces={false}
        />

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {slides.map((slide, index) => {
            const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 28, 8],
              extrapolate: 'clamp',
            });
            const dotOpacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            const dotColor = scrollX.interpolate({
              inputRange,
              outputRange: [courtColors.textMuted, slide.accentColor, courtColors.textMuted],
              extrapolate: 'clamp',
            });

            return (
              <TouchableOpacity
                key={slide.id}
                onPress={() => goToSlide(index)}
                activeOpacity={0.7}
              >
                <Animated.View
                  style={[
                    styles.dot,
                    {
                      width: dotWidth,
                      opacity: dotOpacity,
                      backgroundColor: dotColor,
                    },
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>

      {/* Bottom Buttons */}
      <Animated.View
        style={[
          styles.footer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: contentSlide }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('SignUp')}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>GET STARTED</Text>
          <View style={styles.buttonArrow}>
            <Text style={styles.buttonArrowText}>→</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryButtonText}>I ALREADY HAVE AN ACCOUNT</Text>
        </TouchableOpacity>
      </Animated.View>
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
  courtLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: courtColors.courtLine,
    transform: [{ rotate: '-25deg' }],
  },
  courtLine1: {
    top: height * 0.15,
    left: -width * 0.5,
  },
  courtLine2: {
    top: height * 0.45,
    left: -width * 0.3,
    opacity: 0.5,
  },
  courtLine3: {
    top: height * 0.75,
    left: -width * 0.2,
    opacity: 0.3,
  },
  centerCourt: {
    position: 'absolute',
    top: height * 0.35,
    right: -80,
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: courtColors.courtLine,
    opacity: 0.5,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  logoContainer: {
    marginBottom: spacing.md,
  },
  basketballLogo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: courtColors.courtOrange,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
  },
  ballLine1: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: courtColors.courtOrange,
  },
  ballLine2: {
    position: 'absolute',
    width: 2,
    height: '100%',
    backgroundColor: courtColors.courtOrange,
  },
  ballLine3: {
    position: 'absolute',
    width: '140%',
    height: 2,
    backgroundColor: courtColors.courtOrange,
    transform: [{ rotate: '45deg' }],
  },
  appName: {
    fontSize: 24,
    fontWeight: '900',
    color: courtColors.white,
    letterSpacing: 4,
    marginBottom: spacing.xs,
  },
  tagline: {
    fontSize: 14,
    color: courtColors.courtOrange,
    fontWeight: '600',
    letterSpacing: 2,
  },
  slidesContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  slide: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  slideContent: {
    alignItems: 'center',
    maxWidth: 340,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    position: 'relative',
  },
  slideIcon: {
    fontSize: 56,
  },
  iconGlow: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 0.2,
    transform: [{ scale: 2 }],
  },
  slideTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: courtColors.white,
    letterSpacing: 6,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  slideSubtitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 3,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  slideDescription: {
    fontSize: 16,
    color: courtColors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.md,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 50 : 30,
  },
  primaryButton: {
    backgroundColor: courtColors.courtOrange,
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    shadowColor: courtColors.courtOrange,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButtonText: {
    color: courtColors.white,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
  },
  buttonArrow: {
    marginLeft: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonArrowText: {
    color: courtColors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: courtColors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
});

export default OnboardingScreen;
