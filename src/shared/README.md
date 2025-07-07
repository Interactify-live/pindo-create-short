# Shared Components and Utilities

This directory contains reusable components, hooks, and utilities that have been extracted from the main application to improve code organization and reusability.

## Structure

```
src/shared/
├── components/          # Reusable UI components
│   ├── Button/         # Standardized button component
│   ├── FileInput/      # File selection component
│   ├── Layout/         # Page layout component
│   ├── Modal/          # Modal dialog component
│   ├── Toast/          # Toast notification component
│   └── index.ts        # Main export file
├── hooks/              # Custom React hooks
│   ├── useCamera.ts    # Camera management hook
│   ├── useMedia.ts     # Media processing hook
│   ├── useToast.ts     # Toast management hook
│   └── index.ts        # Main export file
├── utils/              # Utility functions
│   ├── mediaUtils.ts   # Media processing utilities
│   ├── validationUtils.ts # Validation utilities
│   └── index.ts        # Main export file
├── constants.ts        # Application constants
└── utils.ts           # General utilities
```

## Components

### Button
A standardized button component with multiple variants and sizes.

```tsx
import { Button } from '../shared/components';

<Button
  variant="primary"
  size="medium"
  onClick={handleClick}
>
  Click me
</Button>
```

### FileInput
A reusable file input component that wraps the native file input.

```tsx
import { FileInput } from '../shared/components';

<FileInput
  onSelect={handleFiles}
  accept="image/*,video/*"
  multiple
>
  <div>Click to select files</div>
</FileInput>
```

### Layout
A flexible layout component for page structure.

```tsx
import { Layout } from '../shared/components';

<Layout
  header={<Header />}
  footer={<Footer />}
  sidebar={<Sidebar />}
>
  <MainContent />
</Layout>
```

### Modal
A reusable modal dialog component.

```tsx
import { Modal } from '../shared/components';

<Modal
  isOpen={showModal}
  onClose={closeModal}
  title="Confirmation"
>
  <p>Are you sure?</p>
</Modal>
```

### Toast
A toast notification component with multiple types.

```tsx
import { Toast } from '../shared/components';

<Toast
  message="Operation successful!"
  type="success"
  onClose={hideToast}
/>
```

## Hooks

### useCamera
Manages camera devices and media streams.

```tsx
import { useCamera } from '../shared/hooks';

const {
  mediaStream,
  devices,
  switchCamera,
  canSwitchCamera
} = useCamera();
```

### useMedia
Handles media file processing and validation.

```tsx
import { useMedia } from '../shared/hooks';

const {
  processMediaFile,
  validateMediaFile,
  isProcessing
} = useMedia();
```

### useToast
Manages toast notification state.

```tsx
import { useToast } from '../shared/hooks';

const { toast, showToast, hideToast } = useToast();
```

## Utilities

### Media Utilities
Functions for processing and validating media files.

```tsx
import {
  processMediaFile,
  validateMediaConstraints,
  validateVideoDuration
} from '../shared/utils';
```

### Validation Utilities
Reusable validation functions and rules.

```tsx
import {
  createValidator,
  commonRules
} from '../shared/utils';

const validateEmail = createValidator([
  commonRules.required('Email'),
  commonRules.email('Email')
]);
```

## Usage Guidelines

1. **Import from shared modules**: Always import components and utilities from the shared directory rather than duplicating code.

2. **Extend existing components**: When creating new components, check if they can be built using existing shared components.

3. **Use custom hooks**: Leverage the provided custom hooks for common functionality like camera management and media processing.

4. **Follow naming conventions**: Use consistent naming for props and interfaces across all shared components.

5. **Document changes**: Update this README when adding new shared components or utilities.

## Benefits

- **Reduced code duplication**: Common patterns are centralized
- **Consistent UI**: Standardized components ensure visual consistency
- **Easier maintenance**: Changes to shared components affect all usages
- **Better testing**: Isolated components are easier to test
- **Improved developer experience**: Clear APIs and documentation