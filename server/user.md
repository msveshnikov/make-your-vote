# User Routes Documentation

## Overview
This file (`server/user.js`) handles all user-related API endpoints in the application, including authentication, registration, password reset, and user profile management. It integrates with Google OAuth for social login and includes email verification functionality.

## Dependencies
```javascript
import User from './models/User.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { authenticateToken } from './middleware/auth.js'
import { OAuth2Client } from 'google-auth-library'
import nodemailer from 'nodemailer'
import crypto from 'crypto'
```

## Configuration
- Uses Google OAuth2 client for authentication
- Configures nodemailer with iCloud email service
- Requires environment variables:
  - `GOOGLE_CLIENT_ID`
  - `EMAIL`
  - `EMAIL_PASSWORD`
  - `JWT_SECRET`
  - `FRONTEND_URL`

## API Endpoints

### 1. User Registration
**Endpoint:** `POST /api/signup`

Handles both traditional and Google OAuth sign-up methods.

**Request Body:**
```javascript
{
  credential?: string,  // Google OAuth credential
  firstName?: string,   // Required for traditional signup
  lastName?: string,    // Required for traditional signup
  email?: string,      // Required for traditional signup
  password?: string    // Required for traditional signup
}
```

**Response:**
- Success (201): `{ message: 'User registered successfully', token: string }`
- Error (500): `{ error: 'Registration failed' }`

### 2. Email Verification
**Endpoint:** `GET /api/verify/:token`

Verifies user's email address using a verification token.

**Parameters:**
- `token`: Verification token sent via email

**Response:**
- Success: HTML page with success message
- Error: HTML page with error message

### 3. Password Reset Request
**Endpoint:** `POST /api/reset-password`

Initiates password reset process.

**Request Body:**
```javascript
{
  email: string
}
```

**Response:**
- Success: `{ message: 'Password reset email sent' }`
- Error (400): `{ error: 'User not found' }`
- Error (500): `{ error: 'Failed to send reset email' }`

### 4. Password Reset
**Endpoint:** `POST /api/reset-password/:token`

Completes password reset process.

**Parameters:**
- `token`: Reset token from email

**Request Body:**
```javascript
{
  password: string
}
```

**Response:**
- Success: `{ message: 'Password reset successful' }`
- Error: `{ error: 'Password reset failed' }`

### 5. User Login
**Endpoint:** `POST /api/login`

Authenticates user credentials.

**Request Body:**
```javascript
{
  email: string,
  password: string
}
```

**Response:**
- Success: `{ token: string }`
- Error: `{ error: string }`

### 6. Get User Profile
**Endpoint:** `GET /api/user`

Retrieves authenticated user's profile.

**Headers Required:**
- `Authorization: Bearer <token>`

**Response:**
- Success: User object (excluding password)
- Error: `{ error: string }`

### 7. Update User Profile
**Endpoint:** `PUT /api/user`

Updates user profile information.

**Headers Required:**
- `Authorization: Bearer <token>`

**Request Body:**
```javascript
{
  firstName?: string,
  lastName?: string,
  email?: string,
  preferences?: {
    language?: string,
    currency?: string,
    travelStyle?: string,
    interests?: string[],
    dietaryRestrictions?: string[],
    accessibility?: string[],
    bio?: string,
    carbon?: boolean,
    notifications?: boolean
  }
}
```

**Response:**
- Success: Updated user object
- Error: `{ error: string }`

## Error Handling
- All endpoints include try-catch blocks for error handling
- Appropriate HTTP status codes are returned
- Detailed error messages for debugging
- Client-friendly error responses

## Security Features
- Password hashing using bcrypt
- JWT-based authentication
- Email verification system
- Secure password reset flow
- Token expiration for password reset

## Integration Points
- Works with User model (`/models/User.js`)
- Uses authentication middleware (`/middleware/auth.js`)
- Integrates with Google OAuth
- Connects with email service (nodemailer)

## Usage Example
```javascript
// Register a new user
fetch('/api/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'securePassword123'
  })
});

// Login
fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'securePassword123'
  })
});
```

## Notes
- Email verification is currently commented out but can be enabled
- Supports both traditional and social authentication
- Includes user preference management
- Designed for scalability and security