# Icons Directory

This directory contains all SVG icons used throughout the application, centralized as React components for better maintainability and consistency.

## Available Icons

### Basic Icons
- `Play` - Play button icon
- `Pause` - Pause button icon
- `Trash` - Delete/trash icon

### UI Icons
- `Flash` - Flashlight/flash icon with on/off state
- `Close` - Close/X button icon
- `Text` - Text input icon
- `Gallery` - Gallery/photo icon
- `Camera` - Camera icon
- `Rotate` - Camera rotation icon
- `Check` - Checkmark/confirmation icon
- `Add` - Add/plus icon
- `Warning` - Warning/alert icon

## Usage

Import icons from the centralized location:

```tsx
import { Flash, Close, Text } from '../icons';

// Use with default props
<Flash />

// Use with custom props
<Flash isFlashOn={true} width="32px" height="32px" fill="red" />
```

## Icon Props

All icons accept the following common props:

- `width` (string) - Icon width (default varies by icon)
- `height` (string) - Icon height (default varies by icon)
- `fill` (string) - Fill color (default varies by icon)
- `stroke` (string) - Stroke color (for stroke-based icons)
- `strokeWidth` (string) - Stroke width (for stroke-based icons)

### Special Props

Some icons have additional props:

- `Flash` - `isFlashOn` (boolean) - Controls flash on/off state

## Benefits

1. **Centralized Management** - All icons in one place
2. **Consistent Styling** - Uniform props and behavior
3. **Type Safety** - TypeScript interfaces for all props
4. **Easy Maintenance** - Update once, affects everywhere
5. **Reusability** - Import and use anywhere in the app
6. **Performance** - No duplicate SVG code

## Adding New Icons

1. Create a new `.tsx` file in this directory
2. Follow the naming convention (PascalCase)
3. Add TypeScript interface for props
4. Export the component as default
5. Add to `index.ts` exports
6. Update this README

## Migration Notes

This directory replaces:
- Inline SVGs throughout components
- Individual SVG files in `src/assets/icons/`
- The old `src/logo.svg` file

All components have been updated to use the new centralized icon system.