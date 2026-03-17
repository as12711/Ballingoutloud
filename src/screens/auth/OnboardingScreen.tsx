import React, { useRef, useEffect, useState } from 'react';
import {
  View,
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
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { H1 } from '@/components/ui/typography';

const { width, height } = Dimensions.get('window');

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
      <View style={{ width }} className="justify-center items-center px-8">
        <Animated.View
          className="items-center max-w-[340px]"
          style={{
            opacity,
            transform: [{ scale }, { translateY }],
          }}
        >
          {/* Large Icon */}
          <View
            className="w-[120px] h-[120px] rounded-3xl justify-center items-center mb-8 relative"
            style={{ backgroundColor: `${item.accentColor}20` }}
          >
            <Text className="text-[56px]">{item.icon}</Text>
            <View
              className="absolute w-[60px] h-[60px] rounded-full opacity-20 scale-[2]"
              style={{ backgroundColor: item.accentColor }}
            />
          </View>

          {/* Title */}
          <H1 className="text-[48px] font-black text-foreground tracking-[6px] mb-1 text-center">
            {item.title}
          </H1>
          <Text
            className="text-xl font-bold tracking-[3px] mb-6 text-center"
            style={{ color: item.accentColor }}
          >
            {item.subtitle}
          </Text>
          <Text className="text-base text-muted-foreground text-center leading-6 px-4">
            {item.description}
          </Text>
        </Animated.View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-background">
      {/* Background Elements */}
      <View className="absolute inset-0 overflow-hidden">
        {/* Diagonal court lines */}
        <Animated.View
          className="absolute h-[2px] bg-primary/20"
          style={{
            top: height * 0.15,
            left: -width * 0.5,
            transform: [{ rotate: '-25deg' }],
            width: courtLineAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '200%'],
            }),
          }}
        />
        <Animated.View
          className="absolute h-[2px] bg-primary/20 opacity-50"
          style={{
            top: height * 0.45,
            left: -width * 0.3,
            transform: [{ rotate: '-25deg' }],
            width: courtLineAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '200%'],
            }),
          }}
        />
        <Animated.View
          className="absolute h-[2px] bg-primary/20 opacity-30"
          style={{
            top: height * 0.75,
            left: -width * 0.2,
            transform: [{ rotate: '-25deg' }],
            width: courtLineAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '150%'],
            }),
          }}
        />

        {/* Center court circle */}
        <Animated.View
          className="absolute w-40 h-40 rounded-full border-2 border-primary/20 opacity-50"
          style={{
            top: height * 0.35,
            right: -80,
            opacity: courtLineAnim,
            transform: [
              {
                scale: courtLineAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                }),
              },
            ],
          }}
        />
      </View>

      {/* Header with Logo */}
      <Animated.View
        className="items-center px-6"
        style={{
          paddingTop: Platform.OS === 'ios' ? 80 : 60,
          opacity: fadeAnim,
          transform: [{ scale: logoScale }],
        }}
      >
        <Animated.View
          className="mb-4"
          style={{ transform: [{ rotate: rotateInterpolation }] }}
        >
          <View className="w-[70px] h-[70px] rounded-full border-[3px] border-primary justify-center items-center overflow-hidden bg-primary/15">
            <View className="absolute w-full h-[2px] bg-primary" />
            <View className="absolute w-[2px] h-full bg-primary" />
            <View className="absolute w-[140%] h-[2px] bg-primary rotate-45" />
          </View>
        </Animated.View>
        <Text className="text-2xl font-black text-foreground tracking-[4px] mb-1">
          BALLING OUT LOUD
        </Text>
        <Text className="text-sm text-primary font-semibold tracking-[2px]">
          Track. Analyze. Excel.
        </Text>
      </Animated.View>

      {/* Slides */}
      <Animated.View
        className="flex-1 justify-center"
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: contentSlide }],
        }}
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
        <View className="flex-row justify-center items-center py-6 gap-2">
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
              outputRange: ['#6B7280', slide.accentColor, '#6B7280'],
              extrapolate: 'clamp',
            });

            return (
              <TouchableOpacity
                key={slide.id}
                onPress={() => goToSlide(index)}
                activeOpacity={0.7}
              >
                <Animated.View
                  className="h-2 rounded-full"
                  style={{
                    width: dotWidth,
                    opacity: dotOpacity,
                    backgroundColor: dotColor,
                  }}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>

      {/* Bottom Buttons */}
      <Animated.View
        className="px-6"
        style={{
          paddingBottom: Platform.OS === 'ios' ? 50 : 30,
          opacity: fadeAnim,
          transform: [{ translateY: contentSlide }],
        }}
      >
        <Button
          onPress={() => navigation.navigate('SignUp')}
          size="lg"
          className="rounded-2xl h-14 mb-4 shadow-lg shadow-primary/30"
        >
          <Text className="text-primary-foreground text-base font-extrabold tracking-[2px]">
            GET STARTED
          </Text>
          <View className="ml-2 bg-white/20 rounded-xl w-7 h-7 justify-center items-center">
            <Text className="text-primary-foreground text-lg font-semibold">→</Text>
          </View>
        </Button>

        <Button
          variant="ghost"
          onPress={() => navigation.navigate('Login')}
          className="py-4"
        >
          <Text className="text-muted-foreground text-[13px] font-semibold tracking-[1.5px]">
            I ALREADY HAVE AN ACCOUNT
          </Text>
        </Button>
      </Animated.View>
    </View>
  );
};

export default OnboardingScreen;
