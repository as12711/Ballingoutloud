import React, { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface SettingToggleProps {
  icon: string;
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const SettingToggle: React.FC<SettingToggleProps> = ({
  icon,
  label,
  description,
  value,
  onValueChange,
}) => {
  return (
    <View className="flex-row items-center py-3 px-3">
      <View className="w-10 h-10 rounded-xl bg-muted items-center justify-center mr-3">
        <Text className="text-lg">{icon}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-[15px] font-semibold text-foreground">{label}</Text>
        {description && (
          <Text className="text-xs text-muted-foreground mt-0.5">{description}</Text>
        )}
      </View>
      <Switch checked={value} onCheckedChange={onValueChange} />
    </View>
  );
};

interface SettingOptionProps {
  icon: string;
  label: string;
  value: string;
  onPress: () => void;
}

const SettingOption: React.FC<SettingOptionProps> = ({
  icon,
  label,
  value,
  onPress,
}) => {
  return (
    <Pressable
      className="flex-row items-center py-3 px-3 active:bg-accent/50 rounded-lg"
      onPress={onPress}
    >
      <View className="w-10 h-10 rounded-xl bg-muted items-center justify-center mr-3">
        <Text className="text-lg">{icon}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-[15px] font-semibold text-foreground">{label}</Text>
      </View>
      <View className="flex-row items-center">
        <Text className="text-sm text-muted-foreground mr-1">{value}</Text>
        <Text className="text-xl text-muted-foreground font-light">›</Text>
      </View>
    </Pressable>
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

  return (
    <ScrollView className="flex-1 bg-background p-4" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="mb-6">
        <Text className="text-3xl font-black text-foreground tracking-wider">
          SETTINGS
        </Text>
        <Text className="text-sm text-muted-foreground mt-1">
          Customize your experience
        </Text>
      </View>

      {/* Notifications Section */}
      <View className="mb-6">
        <Text className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
          Notifications
        </Text>
        <Card>
          <CardContent className="py-1 px-1">
            <SettingToggle
              icon="🔔"
              label="Push Notifications"
              description="Enable all push notifications"
              value={pushNotifications}
              onValueChange={setPushNotifications}
            />
            <Separator className="ml-16" />
            <SettingToggle
              icon="🏀"
              label="Game Alerts"
              description="Get notified when games start"
              value={gameAlerts}
              onValueChange={setGameAlerts}
            />
            <Separator className="ml-16" />
            <SettingToggle
              icon="📊"
              label="Stat Updates"
              description="Real-time stat notifications"
              value={statUpdates}
              onValueChange={setStatUpdates}
            />
          </CardContent>
        </Card>
      </View>

      {/* Appearance Section */}
      <View className="mb-6">
        <Text className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
          Appearance
        </Text>
        <Card>
          <CardContent className="py-1 px-1">
            <SettingToggle
              icon="🌙"
              label="Dark Mode"
              description="Use dark theme"
              value={darkMode}
              onValueChange={setDarkMode}
            />
            <Separator className="ml-16" />
            <SettingOption
              icon="🎨"
              label="Accent Color"
              value="Orange"
              onPress={() => {}}
            />
            <Separator className="ml-16" />
            <SettingOption
              icon="🔤"
              label="Font Size"
              value="Medium"
              onPress={() => {}}
            />
          </CardContent>
        </Card>
      </View>

      {/* General Section */}
      <View className="mb-6">
        <Text className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
          General
        </Text>
        <Card>
          <CardContent className="py-1 px-1">
            <SettingToggle
              icon="📳"
              label="Haptic Feedback"
              description="Vibrate on interactions"
              value={hapticFeedback}
              onValueChange={setHapticFeedback}
            />
            <Separator className="ml-16" />
            <SettingOption
              icon="🌐"
              label="Language"
              value="English"
              onPress={() => {}}
            />
            <Separator className="ml-16" />
            <SettingOption
              icon="📏"
              label="Units"
              value="Imperial"
              onPress={() => {}}
            />
          </CardContent>
        </Card>
      </View>

      {/* Data & Storage Section */}
      <View className="mb-6">
        <Text className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
          Data & Storage
        </Text>
        <Card>
          <CardContent className="py-1 px-1">
            <SettingToggle
              icon="🔄"
              label="Auto Sync"
              description="Sync data automatically"
              value={autoSync}
              onValueChange={setAutoSync}
            />
            <Separator className="ml-16" />
            <SettingToggle
              icon="📴"
              label="Offline Mode"
              description="Cache data for offline use"
              value={offlineMode}
              onValueChange={setOfflineMode}
            />
            <Separator className="ml-16" />
            <SettingOption
              icon="💾"
              label="Storage Used"
              value="24.5 MB"
              onPress={() => {}}
            />
          </CardContent>
        </Card>
      </View>

      {/* Danger Zone */}
      <View className="mb-6">
        <Text className="text-sm font-medium text-destructive uppercase tracking-wide mb-2">
          Danger Zone
        </Text>
        <Card className="border-destructive/20">
          <CardContent className="py-1 px-1">
            <Pressable className="flex-row items-center py-3 px-3 active:bg-destructive/10 rounded-lg">
              <View className="w-10 h-10 rounded-xl bg-destructive/10 items-center justify-center mr-3">
                <Text className="text-lg">🗑️</Text>
              </View>
              <View className="flex-1">
                <Text className="text-[15px] font-semibold text-destructive">Clear Cache</Text>
                <Text className="text-xs text-muted-foreground mt-0.5">Remove all cached data</Text>
              </View>
            </Pressable>
            <Separator className="ml-16" />
            <Pressable className="flex-row items-center py-3 px-3 active:bg-destructive/10 rounded-lg">
              <View className="w-10 h-10 rounded-xl bg-destructive/10 items-center justify-center mr-3">
                <Text className="text-lg">⚠️</Text>
              </View>
              <View className="flex-1">
                <Text className="text-[15px] font-semibold text-destructive">Reset All Settings</Text>
                <Text className="text-xs text-muted-foreground mt-0.5">Restore default settings</Text>
              </View>
            </Pressable>
          </CardContent>
        </Card>
      </View>

      {/* Footer */}
      <View className="items-center py-6 pb-12">
        <View className="flex-row items-center mb-2">
          <Pressable>
            <Text className="text-sm text-primary font-semibold">Terms of Service</Text>
          </Pressable>
          <Text className="text-muted-foreground mx-2">•</Text>
          <Pressable>
            <Text className="text-sm text-primary font-semibold">Privacy Policy</Text>
          </Pressable>
        </View>
        <Text className="text-xs text-muted-foreground opacity-60">
          Version 1.0.0 (Build 42)
        </Text>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;
