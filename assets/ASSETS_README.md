## Required Assets for TestFlight / App Store

Before building for TestFlight, you MUST add the following image assets to this directory:

### icon.png
- **Size**: 1024x1024 pixels
- **Format**: PNG (no alpha/transparency)
- **Usage**: App icon displayed on home screen, App Store, and TestFlight

### splash.png
- **Size**: 1284x2778 pixels (recommended for iPhone 14 Pro Max)
- **Format**: PNG
- **Usage**: Splash/launch screen displayed while the app loads

### adaptive-icon.png (Android only)
- **Size**: 1024x1024 pixels
- **Format**: PNG (with transparency allowed)
- **Usage**: Android adaptive icon foreground layer

### favicon.png (Web only)
- **Size**: 48x48 pixels
- **Format**: PNG
- **Usage**: Browser tab icon for web builds

### How to generate quickly:
You can use tools like:
- [Figma](https://figma.com) - Design and export
- [Icon Kitchen](https://icon.kitchen) - Free icon generator
- `npx expo-optimize` - Optimize existing assets
- [App Icon Generator](https://www.appicon.co/) - Upload one image, get all sizes
