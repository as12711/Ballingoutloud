import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Easing,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { useAuth } from '../../hooks/useAuth';
import { spacing } from '../../config/theme';

const { width } = Dimensions.get('window');

// Court Vision Design System
const courtColors = {
  deepNavy: '#0A1929',
  midNavy: '#0D2137',
  cardBg: '#111B27',
  courtOrange: '#FF6B35',
  courtOrangeLight: '#FF8A5B',
  white: '#FFFFFF',
  textMuted: '#6B7280',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  courtLine: 'rgba(255, 107, 53, 0.1)',
  cardBorder: 'rgba(255, 255, 255, 0.06)',
};

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

interface MenuItemProps {
  icon: string;
  label: string;
  sublabel?: string;
  onPress: () => void;
  delay: number;
  showArrow?: boolean;
  destructive?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  sublabel,
  onPress,
  delay,
  showArrow = true,
  destructive = false,
}) => {
  const slideAnim = useRef(new Animated.Value(30)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay]);

  return (
    <Animated.View
      style={{
        opacity: opacityAnim,
        transform: [{ translateX: slideAnim }],
      }}
    >
      <TouchableOpacity
        style={styles.menuItem}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={[styles.menuIconContainer, destructive && styles.menuIconDestructive]}>
          <Text style={styles.menuIcon}>{icon}</Text>
        </View>
        <View style={styles.menuContent}>
          <Text style={[styles.menuLabel, destructive && styles.menuLabelDestructive]}>
            {label}
          </Text>
          {sublabel && <Text style={styles.menuSublabel}>{sublabel}</Text>}
        </View>
        {showArrow && <Text style={styles.menuArrow}>›</Text>}
      </TouchableOpacity>
    </Animated.View>
  );
};

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, signOut } = useAuth();

  // Animations
  const headerAnim = useRef(new Animated.Value(0)).current;
  const avatarScale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.spring(avatarScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => signOut(),
        },
      ]
    );
  };

  const getRoleBadgeColor = (role?: string) => {
    switch (role?.toLowerCase()) {
      case 'coach': return courtColors.courtOrange;
      case 'player': return courtColors.success;
      case 'parent': return '#8B5CF6';
      case 'fan': return '#3B82F6';
      case 'admin': return courtColors.warning;
      default: return courtColors.textMuted;
    }
  };

  const getRoleIcon = (role?: string) => {
    switch (role?.toLowerCase()) {
      case 'coach': return '📋';
      case 'player': return '🏀';
      case 'parent': return '👨‍👩‍👧';
      case 'fan': return '🎉';
      case 'admin': return '⚙️';
      default: return '👤';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Background */}
      <View style={styles.backgroundContainer}>
        <View style={[styles.courtLine, styles.courtLine1]} />
        <View style={[styles.courtLine, styles.courtLine2]} />
        <Animated.View
          style={[
            styles.headerGradient,
            {
              opacity: headerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
            },
          ]}
        />
      </View>

      {/* Profile Header */}
      <Animated.View
        style={[
          styles.profileHeader,
          {
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-30, 0],
                }),
              },
            ],
          },
        ]}
      >
        {/* Avatar */}
        <Animated.View style={[styles.avatarContainer, { transform: [{ scale: avatarScale }] }]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.fullName?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || '?'}
            </Text>
          </View>
          <View style={[styles.roleBadge, { backgroundColor: getRoleBadgeColor(user?.role) }]}>
            <Text style={styles.roleBadgeIcon}>{getRoleIcon(user?.role)}</Text>
          </View>
        </Animated.View>

        {/* User Info */}
        <Text style={styles.userName}>{user?.fullName || 'User'}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>

        {/* Role Badge */}
        <View style={[styles.roleTag, { backgroundColor: `${getRoleBadgeColor(user?.role)}20` }]}>
          <Text style={[styles.roleTagText, { color: getRoleBadgeColor(user?.role) }]}>
            {user?.role?.toUpperCase() || 'USER'}
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>24</Text>
            <Text style={styles.quickStatLabel}>Games</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>3</Text>
            <Text style={styles.quickStatLabel}>Teams</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>156</Text>
            <Text style={styles.quickStatLabel}>Stats Tracked</Text>
          </View>
        </View>
      </Animated.View>

      {/* Menu Sections */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        <MenuItem
          icon="✏️"
          label="Edit Profile"
          sublabel="Update your personal information"
          onPress={() => {}}
          delay={100}
        />
        <MenuItem
          icon="🔔"
          label="Notifications"
          sublabel="Manage push notifications"
          onPress={() => {}}
          delay={150}
        />
        <MenuItem
          icon="🔒"
          label="Privacy & Security"
          sublabel="Password and security settings"
          onPress={() => {}}
          delay={200}
        />
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>APP</Text>
        <MenuItem
          icon="⚙️"
          label="Settings"
          sublabel="App preferences and display"
          onPress={() => navigation.navigate('Settings')}
          delay={250}
        />
        <MenuItem
          icon="🎨"
          label="Appearance"
          sublabel="Theme and display options"
          onPress={() => {}}
          delay={300}
        />
        <MenuItem
          icon="❓"
          label="Help & Support"
          sublabel="FAQ and contact support"
          onPress={() => {}}
          delay={350}
        />
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>DATA</Text>
        <MenuItem
          icon="📊"
          label="Export Stats"
          sublabel="Download your statistics"
          onPress={() => {}}
          delay={400}
        />
        <MenuItem
          icon="📁"
          label="Backup Data"
          sublabel="Sync and backup your data"
          onPress={() => {}}
          delay={450}
        />
      </View>

      <View style={[styles.menuSection, styles.lastSection]}>
        <MenuItem
          icon="🚪"
          label="Sign Out"
          onPress={handleSignOut}
          delay={500}
          showArrow={false}
          destructive
        />
      </View>

      {/* App Version */}
      <Animated.View style={[styles.versionContainer, { opacity: headerAnim }]}>
        <Text style={styles.versionText}>Balling Out Loud v1.0.0</Text>
        <Text style={styles.copyrightText}>© 2026 All rights reserved</Text>
      </Animated.View>
    </ScrollView>
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
    height: 1,
    backgroundColor: courtColors.courtLine,
    transform: [{ rotate: '-20deg' }],
    width: width * 2,
  },
  courtLine1: {
    top: '20%',
    left: -width * 0.5,
  },
  courtLine2: {
    top: '60%',
    left: -width * 0.3,
    opacity: 0.5,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 280,
    backgroundColor: courtColors.courtOrange,
    opacity: 0.05,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: courtColors.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: courtColors.courtOrange,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '800',
    color: courtColors.courtOrange,
  },
  roleBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: courtColors.deepNavy,
  },
  roleBadgeIcon: {
    fontSize: 16,
  },
  userName: {
    fontSize: 26,
    fontWeight: '800',
    color: courtColors.white,
    letterSpacing: 1,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: courtColors.textMuted,
    marginBottom: spacing.sm,
  },
  roleTag: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: spacing.lg,
  },
  roleTagText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: courtColors.cardBg,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: courtColors.cardBorder,
    width: '100%',
  },
  quickStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  quickStatValue: {
    fontSize: 24,
    fontWeight: '800',
    color: courtColors.white,
  },
  quickStatLabel: {
    fontSize: 11,
    color: courtColors.textMuted,
    fontWeight: '600',
    marginTop: 2,
  },
  quickStatDivider: {
    width: 1,
    backgroundColor: courtColors.cardBorder,
    marginHorizontal: spacing.sm,
  },
  menuSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  lastSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: courtColors.courtOrange,
    letterSpacing: 2,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: courtColors.cardBg,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: courtColors.cardBorder,
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  menuIconDestructive: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  menuIcon: {
    fontSize: 20,
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: courtColors.white,
  },
  menuLabelDestructive: {
    color: courtColors.error,
  },
  menuSublabel: {
    fontSize: 12,
    color: courtColors.textMuted,
    marginTop: 2,
  },
  menuArrow: {
    fontSize: 22,
    color: courtColors.textMuted,
    fontWeight: '300',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingBottom: spacing.xxl * 2,
  },
  versionText: {
    fontSize: 13,
    color: courtColors.textMuted,
    fontWeight: '600',
  },
  copyrightText: {
    fontSize: 11,
    color: courtColors.textMuted,
    marginTop: 4,
    opacity: 0.6,
  },
});

export default ProfileScreen;
