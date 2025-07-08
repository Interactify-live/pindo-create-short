# @livuvo/short-sdk-wizard

A React component library for creating interactive short-form videos with text overlays and media management.

## Installation

```bash
npm install @livuvo/short-sdk-wizard
```

## Usage

```jsx
import React from "react";
import { CaputureWizard } from "@livuvo/short-sdk-wizard";

function App() {
  const handleFinish = (medias) => {
    console.log("Finished with medias:", medias);
  };

  const uploadFile = async (file, onProgress) => {
    // Implement your file upload logic here
    // Return the uploaded file URL
    return "https://example.com/uploaded-file.mp4";
  };

  return (
    <div style={{ height: "100vh" }}>
      <CaputureWizard onFinish={handleFinish} uploadFile={uploadFile} />
    </div>
  );
}

export default App;
```

## TypeScript Support

This package includes TypeScript definitions out of the box. No additional installation needed.

```typescript
import {
  MediaResult,
  FileType,
  Media,
  VideoType,
  ImageType,
} from "@livuvo/short-sdk-wizard";
```

## Available Components

- `CaputureWizard`: Main component for the complete video creation workflow
- `Capture`: Component for video/image capture and recording
- `ShortCreateInteractionsStep`: Component for adding interactions to media

## Requirements

- React 18.2.0 or higher
- React DOM 18.2.0 or higher

## Browser Support

This library requires modern browsers with support for:

- MediaDevices API
- WebRTC
- ES6+ features

## Development with npm link

If you're using `npm link` for local development, you may encounter webpack compilation errors. To fix this, update your webpack configuration:

```javascript
// In your webpack config
module: {
  rules: [
    {
      test: /\.[jt]sx?$/,
      exclude: [
        /node_modules/,
        // Specifically exclude the linked package
        /pindo/,
        /@livuvo\/short-sdk-wizard/
      ],
      use: 'babel-loader'
    }
  ]
},

resolve: {
  extensions: ['.tsx', '.ts', '.js', '.jsx'],
  modules: ['node_modules'],
  alias: {
    '@livuvo/short-sdk-wizard': require.resolve('@livuvo/short-sdk-wizard')
  }
},

// Ignore declaration files
ignoreWarnings: [
  /Module parse failed: Unexpected token/,
  /Can't resolve/,
  /The keyword 'interface' is reserved/
]
```

## Troubleshooting

### Webpack Compilation Errors

If you encounter webpack compilation errors related to TypeScript declaration files, ensure your webpack configuration properly excludes `node_modules` and the linked package:

```javascript
// In your webpack config
module: {
  rules: [
    {
      test: /\.[jt]sx?$/,
      exclude: /node_modules/, // This is crucial
      use: "babel-loader",
    },
  ];
}
```

### Chunk Loading Errors

If you see "Loading chunk X failed" errors, this has been fixed in the latest version. Make sure you're using the latest version of the package.

### TypeScript Declaration Issues

TypeScript definitions are included in the main package. If you encounter any issues, make sure you're using the latest version.

## Package Structure

- `@livuvo/short-sdk-wizard`: Main component library with TypeScript definitions included

## License

MIT
