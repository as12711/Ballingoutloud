import React from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { useAuth } from '../../hooks/useAuth';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

interface MenuItemProps {
  icon: string;
  label: string;
  sublabel?: string;
  onPress: () => void;
  showArrow?: boolean;
  destructive?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  sublabel,
  onPress,
  showArrow = true,
  destructive = false,
}) => {
  return (
    <Button
      variant={destructive ? 'destructive' : 'ghost'}
      className={`flex-row items-center justify-start gap-3 h-auto py-3 px-3 ${
        destructive ? '' : 'w-full'
      }`}
      onPress={onPress}
    >
      <View
        className={`w-11 h-11 rounded-xl items-center justify-center ${
          destructive ? 'bg-destructive/10' : 'bg-muted'
        }`}
      >
        <Text className="text-lg">{icon}</Text>
      </View>
      <View className="flex-1">
        <Text
          className={`text-[15px] font-semibold ${
            destructive ? 'text-destructive' : 'text-foreground'
          }`}
        >
          {label}
        </Text>
        {sublabel && (
          <Text className="text-xs text-muted-foreground mt-0.5">{sublabel}</Text>
        )}
      </View>
      {showArrow && (
        <Text className="text-xl text-muted-foreground font-light">›</Text>
      )}
    </Button>
  );
};

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, signOut } = useAuth();

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

  const getRoleVariant = (role?: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (role?.toLowerCase()) {
      case 'coach': return 'default';
      case 'player': return 'secondary';
      case 'admin': return 'destructive';
      default: return 'outline';
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
    <ScrollView className="flex-1 bg-background" showsVerticalScrollIndicator={false}>
      {/* Profile Header Card */}
      <Card className="mx-4 mt-4">
        <CardHeader className="items-center">
          {/* Avatar */}
          <View className="relative mb-3">
            <View className="w-24 h-24 rounded-3xl bg-primary/10 border-2 border-primary items-center justify-center">
              <Text className="text-4xl font-extrabold text-primary">
                {user?.fullName?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || '?'}
              </Text>
            </View>
            <View className="absolute -bottom-1 -right-1 w-9 h-9 rounded-xl bg-primary items-center justify-center border-[3px] border-background">
              <Text className="text-sm">{getRoleIcon(user?.role)}</Text>
            </View>
          </View>

          {/* User Info */}
          <Text className="text-2xl font-extrabold text-foreground tracking-wide">
            {user?.fullName || 'User'}
          </Text>
          <Text className="text-sm text-muted-foreground">{user?.email}</Text>

          {/* Role Badge */}
          <Badge variant={getRoleVariant(user?.role)} className="mt-2">
            <Text>{user?.role?.toUpperCase() || 'USER'}</Text>
          </Badge>
        </CardHeader>

        {/* Quick Stats */}
        <CardContent>
          <View className="flex-row bg-muted rounded-2xl p-4">
            <View className="flex-1 items-center">
              <Text className="text-2xl font-extrabold text-foreground">24</Text>
              <Text className="text-xs text-muted-foreground font-semibold mt-0.5">Games</Text>
            </View>
            <Separator orientation="vertical" />
            <View className="flex-1 items-center">
              <Text className="text-2xl font-extrabold text-foreground">3</Text>
              <Text className="text-xs text-muted-foreground font-semibold mt-0.5">Teams</Text>
            </View>
            <Separator orientation="vertical" />
            <View className="flex-1 items-center">
              <Text className="text-2xl font-extrabold text-foreground">156</Text>
              <Text className="text-xs text-muted-foreground font-semibold mt-0.5">Stats Tracked</Text>
            </View>
          </View>
        </CardContent>
      </Card>

      {/* Account Section */}
      <View className="px-4 mt-6">
        <Text className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
          Account
        </Text>
        <Card>
          <CardContent className="py-1 px-1">
            <MenuItem
              icon="✏️"
              label="Edit Profile"
              sublabel="Update your personal information"
              onPress={() => {}}
            />
            <Separator className="ml-16" />
            <MenuItem
              icon="🔔"
              label="Notifications"
              sublabel="Manage push notifications"
              onPress={() => {}}
            />
            <Separator className="ml-16" />
            <MenuItem
              icon="🔒"
              label="Privacy & Security"
              sublabel="Password and security settings"
              onPress={() => {}}
            />
          </CardContent>
        </Card>
      </View>

      {/* App Section */}
      <View className="px-4 mt-6">
        <Text className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
          App
        </Text>
        <Card>
          <CardContent className="py-1 px-1">
            <MenuItem
              icon="⚙️"
              label="Settings"
              sublabel="App preferences and display"
              onPress={() => navigation.navigate('Settings')}
            />
            <Separator className="ml-16" />
            <MenuItem
              icon="🎨"
              label="Appearance"
              sublabel="Theme and display options"
              onPress={() => {}}
            />
            <Separator className="ml-16" />
            <MenuItem
              icon="❓"
              label="Help & Support"
              sublabel="FAQ and contact support"
              onPress={() => {}}
            />
          </CardContent>
        </Card>
      </View>

      {/* Data Section */}
      <View className="px-4 mt-6">
        <Text className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
          Data
        </Text>
        <Card>
          <CardContent className="py-1 px-1">
            <MenuItem
              icon="📊"
              label="Export Stats"
              sublabel="Download your statistics"
              onPress={() => {}}
            />
            <Separator className="ml-16" />
            <MenuItem
              icon="📁"
              label="Backup Data"
              sublabel="Sync and backup your data"
              onPress={() => {}}
            />
          </CardContent>
        </Card>
      </View>

      {/* Sign Out */}
      <View className="px-4 mt-6 mb-4">
        <Button variant="destructive" className="w-full" onPress={handleSignOut}>
          <Text>Sign Out</Text>
        </Button>
      </View>

      {/* App Version */}
      <View className="items-center py-6 pb-12">
        <Text className="text-sm text-muted-foreground font-semibold">
          Balling Out Loud v1.0.0
        </Text>
        <Text className="text-xs text-muted-foreground mt-1 opacity-60">
          © 2026 All rights reserved
        </Text>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
