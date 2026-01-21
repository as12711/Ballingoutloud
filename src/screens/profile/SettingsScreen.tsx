import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
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
  courtLine: 'rgba(255, 107, 53, 0.1)',
  cardBorder: 'rgba(255, 255, 255, 0.06)',
};

interface SettingToggleProps {
  icon: string;
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  delay: number;
}

const SettingToggle: React.FC<SettingToggleProps> = ({
  icon,
  label,
  description,
  value,
  onValueChange,
  delay,
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
      style={[
        styles.settingItem,
        {
          opacity: opacityAnim,
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      <View style={styles.settingIconContainer}>
        <Text style={styles.settingIcon}>{icon}</Text>
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingLabel}>{label}</Text>
        {description && <Text style={styles.settingDescription}>{description}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: courtColors.courtOrange }}
        thumbColor={courtColors.white}
        ios_backgroundColor="rgba(255, 255, 255, 0.1)"
      />
    </Animated.View>
  );
};

interface SettingOptionProps {
  icon: string;
  label: string;
  value: string;
  onPress: () => void;
  delay: number;
}

const SettingOption: React.FC<SettingOptionProps> = ({
  icon,
  label,
  value,
  onPress,
  delay,
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
        style={styles.settingItem}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.settingIconContainer}>
          <Text style={styles.settingIcon}>{icon}</Text>
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingLabel}>{label}</Text>
        </View>
        <View style={styles.settingValueContainer}>
          <Text style={styles.settingValue}>{value}</Text>
          <Text style={styles.settingArrow}>›</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const SettingsScreen: React.FC = () => {
  // Settings state
  const [pushNotifications, setPushNotifications] = useState(true);
  const [gameAlerts, setGameAlerts] = useState(true);
  const [statUpdates, setStatUpdates] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  // Animation
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Background */}
      <View style={styles.backgroundContainer}>
        <View style={[styles.courtLine, styles.courtLine1]} />
        <View style={[styles.courtLine, styles.courtLine2]} />
      </View>

      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.headerTitle}>SETTINGS</Text>
        <Text style={styles.headerSubtitle}>Customize your experience</Text>
      </Animated.View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
        <View style={styles.sectionCard}>
          <SettingToggle
            icon="🔔"
            label="Push Notifications"
            description="Enable all push notifications"
            value={pushNotifications}
            onValueChange={setPushNotifications}
            delay={100}
          />
          <View style={styles.divider} />
          <SettingToggle
            icon="🏀"
            label="Game Alerts"
            description="Get notified when games start"
            value={gameAlerts}
            onValueChange={setGameAlerts}
            delay={150}
          />
          <View style={styles.divider} />
          <SettingToggle
            icon="📊"
            label="Stat Updates"
            description="Real-time stat notifications"
            value={statUpdates}
            onValueChange={setStatUpdates}
            delay={200}
          />
        </View>
      </View>

      {/* Appearance Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>APPEARANCE</Text>
        <View style={styles.sectionCard}>
          <SettingToggle
            icon="🌙"
            label="Dark Mode"
            description="Use dark theme"
            value={darkMode}
            onValueChange={setDarkMode}
            delay={250}
          />
          <View style={styles.divider} />
          <SettingOption
            icon="🎨"
            label="Accent Color"
            value="Orange"
            onPress={() => {}}
            delay={300}
          />
          <View style={styles.divider} />
          <SettingOption
            icon="🔤"
            label="Font Size"
            value="Medium"
            onPress={() => {}}
            delay={350}
          />
        </View>
      </View>

      {/* General Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>GENERAL</Text>
        <View style={styles.sectionCard}>
          <SettingToggle
            icon="📳"
            label="Haptic Feedback"
            description="Vibrate on interactions"
            value={hapticFeedback}
            onValueChange={setHapticFeedback}
            delay={400}
          />
          <View style={styles.divider} />
          <SettingOption
            icon="🌐"
            label="Language"
            value="English"
            onPress={() => {}}
            delay={450}
          />
          <View style={styles.divider} />
          <SettingOption
            icon="📏"
            label="Units"
            value="Imperial"
            onPress={() => {}}
            delay={500}
          />
        </View>
      </View>

      {/* Data & Storage Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DATA & STORAGE</Text>
        <View style={styles.sectionCard}>
          <SettingToggle
            icon="🔄"
            label="Auto Sync"
            description="Sync data automatically"
            value={autoSync}
            onValueChange={setAutoSync}
            delay={550}
          />
          <View style={styles.divider} />
          <SettingToggle
            icon="📴"
            label="Offline Mode"
            description="Cache data for offline use"
            value={offlineMode}
            onValueChange={setOfflineMode}
            delay={600}
          />
          <View style={styles.divider} />
          <SettingOption
            icon="💾"
            label="Storage Used"
            value="24.5 MB"
            onPress={() => {}}
            delay={650}
          />
        </View>
      </View>

      {/* Danger Zone */}
      <View style={[styles.section, styles.lastSection]}>
        <Text style={[styles.sectionTitle, styles.dangerTitle]}>DANGER ZONE</Text>
        <View style={[styles.sectionCard, styles.dangerCard]}>
          <TouchableOpacity style={styles.dangerButton} activeOpacity={0.7}>
            <View style={styles.dangerIconContainer}>
              <Text style={styles.dangerIcon}>🗑️</Text>
            </View>
            <View style={styles.dangerContent}>
              <Text style={styles.dangerLabel}>Clear Cache</Text>
              <Text style={styles.dangerDescription}>Remove all cached data</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.dangerButton} activeOpacity={0.7}>
            <View style={styles.dangerIconContainer}>
              <Text style={styles.dangerIcon}>⚠️</Text>
            </View>
            <View style={styles.dangerContent}>
              <Text style={styles.dangerLabel}>Reset All Settings</Text>
              <Text style={styles.dangerDescription}>Restore default settings</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <Animated.View style={[styles.footer, { opacity: headerAnim }]}>
        <View style={styles.footerLinks}>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Terms of Service</Text>
          </TouchableOpacity>
          <Text style={styles.footerDot}>•</Text>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.footerVersion}>Version 1.0.0 (Build 42)</Text>
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
    top: '25%',
    left: -width * 0.5,
  },
  courtLine2: {
    top: '65%',
    left: -width * 0.3,
    opacity: 0.5,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: courtColors.white,
    letterSpacing: 3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: courtColors.textMuted,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  lastSection: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: courtColors.courtOrange,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  dangerTitle: {
    color: '#EF4444',
  },
  sectionCard: {
    backgroundColor: courtColors.cardBg,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: courtColors.cardBorder,
  },
  dangerCard: {
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  settingIcon: {
    fontSize: 18,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: courtColors.white,
  },
  settingDescription: {
    fontSize: 12,
    color: courtColors.textMuted,
    marginTop: 2,
  },
  settingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: courtColors.textMuted,
    marginRight: spacing.xs,
  },
  settingArrow: {
    fontSize: 20,
    color: courtColors.textMuted,
    fontWeight: '300',
  },
  divider: {
    height: 1,
    backgroundColor: courtColors.cardBorder,
    marginLeft: 68,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  dangerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  dangerIcon: {
    fontSize: 18,
  },
  dangerContent: {
    flex: 1,
  },
  dangerLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EF4444',
  },
  dangerDescription: {
    fontSize: 12,
    color: courtColors.textMuted,
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingBottom: spacing.xxl * 2,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  footerLink: {
    fontSize: 13,
    color: courtColors.courtOrange,
    fontWeight: '600',
  },
  footerDot: {
    color: courtColors.textMuted,
    marginHorizontal: spacing.sm,
  },
  footerVersion: {
    fontSize: 12,
    color: courtColors.textMuted,
    opacity: 0.6,
  },
});

export default SettingsScreen;
