# App.jsx Documentation

## Overview

`App.jsx` serves as the root component of the React application, handling routing, theme
configuration, and global context setup. It integrates Google Analytics, OAuth authentication, and
Chakra UI theming while providing the main routing structure for the application.

## Key Components

### Constants

```javascript
export const API_URL = import.meta.env.DEV ? 'http://localhost:3000' : 'https://makeyour.vote';
export const AuthContext = createContext(null);
```

- `API_URL`: Environment-dependent API endpoint
- `AuthContext`: React context for authentication state management

### Theme Configuration

```javascript
const theme = extendTheme({...})
```

Customizes the Chakra UI theme with:

- Light mode as default
- Full border radius for buttons
- Custom background gradient
- Disabled system color mode

## Main Component

### App

The primary component that initializes the application.

#### Effects

- Initializes Google Analytics (GA4) on component mount
- Tracks page views automatically

#### Routes

| Path         | Component             | Description             |
| ------------ | --------------------- | ----------------------- |
| `/`          | `<Landing />`         | Home/landing page       |
| `/app/*`     | `<Vote />`            | Main voting application |
| `/topic/:id` | `<Topic />`           | Individual topic view   |
| `/privacy`   | `<Privacy />`         | Privacy policy          |
| `/terms`     | `<Terms />`           | Terms of service        |
| `/login`     | `<Login />`           | User login              |
| `/signup`    | `<Signup />`          | User registration       |
| `/admin`     | `<Admin />`           | Admin dashboard         |
| `*`          | `<Navigate to="/" />` | Fallback route          |

## Provider Structure

```
<ChakraProvider>
  <GoogleOAuthProvider>
    <Router>
      <Routes>
        // Route definitions
      </Routes>
    </Router>
  </GoogleOAuthProvider>
</ChakraProvider>
```

## Dependencies

- `react-router-dom`: Routing management
- `@chakra-ui/react`: UI component library
- `react-ga4`: Google Analytics integration
- `@react-oauth/google`: Google OAuth authentication

## Environment Variables

- `VITE_GOOGLE_CLIENT_ID`: Required for Google OAuth integration
- `import.meta.env.DEV`: Used to determine API URL based on environment

## Usage Example

```javascript
import App from './App';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

## Project Context

Within the project structure, `App.jsx` acts as the central routing and configuration hub,
connecting various components:

- Integrates with authentication system (`Login.jsx`, `Signup.jsx`)
- Provides routing for main features (`Vote.jsx`, `Topic.jsx`)
- Handles administrative access (`Admin.jsx`)
- Manages legal pages (`Privacy.jsx`, `Terms.jsx`)

## Notes

- The application uses a custom theme with a light color scheme
- All routes are protected by the authentication context
- Google Analytics is automatically initialized and tracks page views
- The API URL automatically switches between development and production environments

This documentation provides a comprehensive overview of the `App.jsx` file and its role in the
application. For specific component implementations, refer to their respective files in the project
structure.
