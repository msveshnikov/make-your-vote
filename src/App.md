# App.jsx Documentation

## Overview

`App.jsx` serves as the root component and main routing configuration for the MakeYour.Vote
application. It establishes the core routing structure and provides essential context for
authentication throughout the application.

## Location

`/src/App.jsx`

## Dependencies

```javascript
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createContext } from 'react';
import { Landing } from './Landing';
import Vote from './Vote.jsx';
```

## Constants

### API_URL

```javascript
export const API_URL = import.meta.env.DEV ? 'http://localhost:3000' : 'https://makeyour.vote';
```

- **Type**: `string`
- **Description**: Dynamic API endpoint that switches between development and production URLs based
  on the environment
- **Usage**:
    - Development: `http://localhost:3000`
    - Production: `https://makeyour.vote`

### AuthContext

```javascript
export const AuthContext = createContext(null);
```

- **Type**: `React.Context`
- **Description**: React context for managing authentication state throughout the application
- **Initial Value**: `null`

## Components

### App

```javascript
function App()
```

- **Description**: Root component that defines the application's routing structure
- **Returns**: React component with router configuration
- **Route Configuration**:
    - `/`: Renders the `Landing` component
    - `/app/*`: Renders the `Vote` component
    - `*`: Redirects all unmatched routes to the landing page

## Routing Structure

```javascript
<Router>
    <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app/*" element={<Vote />} />
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
</Router>
```

## Usage Example

```javascript
import App from './App';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

## Project Context

- Acts as the primary routing configuration for the application
- Integrates with the server-side components defined in `/server`
- Provides routing for both the landing page and the main application interface
- Works in conjunction with `Landing.jsx` and `Vote.jsx` to create the complete user experience

## Related Files

- `src/Landing.jsx`: Landing page component
- `src/Vote.jsx`: Main application component
- `src/main.jsx`: Application entry point

## Notes

- The application uses Vite for development and building (see `vite.config.js`)
- Environmental variables are handled through Vite's `import.meta.env`
- The application supports both development and production environments with different API endpoints
