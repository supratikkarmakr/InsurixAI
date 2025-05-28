# Inter Font Integration

The app has been updated to use Inter font (an excellent open-source alternative to Google's Product Sans) throughout the entire application.

## What Changed

### 1. Font Installation
- Added `@expo-google-fonts/inter` package for Inter font variants
- Created font loading system in `src/hooks/useFonts.ts`
- Added font loading screen in the main app layout

### 2. Theme System Update
- Updated `contexts/ThemeContext.tsx` to include font family definitions
- Added Inter font families for different weights:
  - `Inter_300Light` - Light weight
  - `Inter_400Regular` - Regular weight  
  - `Inter_500Medium` - Medium weight
  - `Inter_600SemiBold` - SemiBold weight
  - `Inter_700Bold` - Bold weight

### 3. Typography Components
Created reusable typography components:

#### Typography Component (`src/components/Typography.tsx`)
```tsx
import { Typography, Heading1, Heading2, Body, Caption } from '@/src/components/Typography';

// Usage examples:
<Typography variant="h1">Main Heading</Typography>
<Typography variant="body1" weight="medium">Body text</Typography>
<Heading1>Quick heading</Heading1>
<Body color="red">Custom colored text</Body>
```

#### Custom Text Component (`src/components/Text.tsx`)
```tsx
import { Text } from '@/src/components/Text';

// Usage examples:
<Text weight="bold" size={18}>Bold text</Text>
<Text weight="light" color="#666">Light gray text</Text>
```

### 4. Global Styles (`src/styles/globalStyles.ts`)
Provides consistent styling utilities:
```tsx
import { textStyles, getFontFamily, createTextStyle } from '@/src/styles/globalStyles';

// Pre-defined styles
<Text style={textStyles.h1}>Heading</Text>
<Text style={textStyles.body1}>Body text</Text>

// Custom styles
const customStyle = createTextStyle('lg', 'semiBold', 28);
```

## How to Use Inter Fonts

### Option 1: Use Typography Components (Recommended)
```tsx
import { Typography } from '@/src/components/Typography';

<Typography variant="h1" weight="bold">
  Main Title
</Typography>
```

### Option 2: Use Custom Text Component
```tsx
import { Text } from '@/src/components/Text';

<Text weight="semiBold" size={20}>
  Custom Text
</Text>
```

### Option 3: Use Theme Context Directly
```tsx
import { useTheme } from '@/contexts/ThemeContext';
import { Text } from 'react-native';

const { theme } = useTheme();

<Text style={{ fontFamily: theme.fonts.medium }}>
  Text with theme font
</Text>
```

### Option 4: Use Global Styles
```tsx
import { textStyles } from '@/src/styles/globalStyles';
import { Text } from 'react-native';

<Text style={textStyles.h2}>
  Heading with predefined style
</Text>
```

## Available Font Weights

- `light` - Inter_300Light
- `regular` - Inter_400Regular (default)
- `medium` - Inter_500Medium
- `semiBold` - Inter_600SemiBold
- `bold` - Inter_700Bold

## Migration from Old Font System

To update existing components to use Inter:

### Before:
```tsx
<Text style={{ fontSize: 24, fontWeight: 'bold' }}>
  Title
</Text>
```

### After:
```tsx
<Typography variant="h3" weight="bold">
  Title
</Typography>
```

Or:
```tsx
<Text weight="bold" size={24}>
  Title
</Text>
```

## Benefits of Inter Font

1. **Designed for screens** - Optimized for UI interfaces
2. **Excellent readability** - Great for both small and large text
3. **Open source** - Free for commercial use
4. **Similar to Product Sans** - Modern, clean geometric appearance
5. **Variable font support** - Smooth weight transitions
6. **Extensive character set** - Supports many languages

## Performance Considerations

- Fonts are loaded asynchronously on app start
- Loading screen is shown while fonts are being loaded
- Only necessary font weights are loaded to minimize bundle size
- Uses Expo's optimized font loading system

## Font Fallbacks

If fonts fail to load, the system will fall back to:
- iOS: San Francisco (system font)
- Android: Roboto (system font)
- Web: System UI fonts 