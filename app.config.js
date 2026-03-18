module.exports = {
  expo: {
    name: "Balling Out Loud",
    slug: "balling-out-loud",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#FFFFFF",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.BOL.stattracker",
      buildNumber: "3",
      infoPlist: {
        NSCameraUsageDescription:
          "This app uses the camera to capture team photos and player avatars.",
        NSPhotoLibraryUsageDescription:
          "This app accesses your photo library to select team logos and player images.",
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF",
      },
      package: "com.BOL.stattracker",
      versionCode: 1,
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro",
    },
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      eas: {
        projectId: "b9050a25-a3c9-460c-afaf-87371f85a789",
      },
    },
    owner: "as12711",
    plugins: [
      "./plugins/withRemovePushEntitlement",
      ["expo-router", {
        origin: "https://ballingoutloud.app",
        asyncRoutes: {
          web: true,
          default: "development",
        },
      }],
    ],
    scheme: "ballingoutloud",
    newArchEnabled: true,
  },
};
