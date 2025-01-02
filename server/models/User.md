# User Model Documentation

## Overview

The `User.js` file defines the Mongoose schema and model for user data in the application. It
handles user authentication, subscription management, and various user-related functionalities. This
model is a crucial part of the server-side architecture, interacting with the MongoDB database and
providing user data management capabilities.

## Schema Definition

### User Schema Fields

| Field Name           | Type    | Description                      | Properties                                 |
| -------------------- | ------- | -------------------------------- | ------------------------------------------ |
| email                | String  | User's email address             | Required, Unique, Trimmed, Lowercase       |
| password             | String  | Hashed password                  | Required                                   |
| firstName            | String  | User's first name                | Trimmed                                    |
| lastName             | String  | User's last name                 | Trimmed                                    |
| profilePicture       | String  | URL to user's profile picture    | Optional                                   |
| subscriptionStatus   | String  | User's subscription level        | Enum: ['free', 'premium'], Default: 'free' |
| subscriptionId       | String  | External subscription identifier | Optional                                   |
| createdAt            | Date    | Account creation timestamp       | Default: Current date                      |
| isAdmin              | Boolean | Administrative privileges flag   | Default: false                             |
| resetPasswordToken   | String  | Token for password reset         | Optional                                   |
| resetPasswordExpires | Date    | Password reset token expiration  | Optional                                   |
| verificationToken    | String  | Email verification token         | Optional                                   |
| emailVerified        | Boolean | Email verification status        | Default: false                             |

## Methods

### Pre-Save Hook

```javascript
userSchema.pre('save', async function (next))
```

Automatically hashes the password before saving if it has been modified.

### comparePassword

```javascript
async function comparePassword(candidatePassword)
```

Compares a provided password with the stored hash.

- **Parameters**: `candidatePassword` (String) - Password to verify
- **Returns**: Promise<Boolean> - True if passwords match

### generatePasswordResetToken

```javascript
function generatePasswordResetToken()
```

Generates a password reset token and sets expiration.

- **Returns**: String - Reset token

### updatePreferences

```javascript
function updatePreferences(newPreferences)
```

Updates user preferences.

- **Parameters**: `newPreferences` (Object) - New preference settings
- **Returns**: Promise<Document> - Updated user document

### upgradeSubscription

```javascript
function upgradeSubscription(subscriptionId)
```

Upgrades user to premium subscription.

- **Parameters**: `subscriptionId` (String) - External subscription identifier
- **Returns**: Promise<Document> - Updated user document

### downgradeSubscription

```javascript
function downgradeSubscription()
```

Downgrades user to free subscription.

- **Returns**: Promise<Document> - Updated user document

### addVisitedCountry

```javascript
function addVisitedCountry(countryCode, countryName)
```

Adds a country to user's visited countries list.

- **Parameters**:
    - `countryCode` (String) - Country code
    - `countryName` (String) - Country name
- **Returns**: Promise<Document> - Updated user document

### canCreateAudioGuide

```javascript
function canCreateAudioGuide()
```

Checks if user can create a new audio guide based on timing restrictions.

- **Returns**: Boolean - Whether user can create an audio guide

## Usage Examples

### Creating a New User

```javascript
const newUser = new User({
    email: 'user@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe'
});
await newUser.save();
```

### Verifying Password

```javascript
const isMatch = await user.comparePassword('password123');
```

### Managing Subscription

```javascript
await user.upgradeSubscription('sub_123xyz');
await user.downgradeSubscription();
```

## Project Context

This User model is central to the application's authentication and user management system. It
integrates with:

- Authentication middleware (`server/middleware/auth.js`)
- User routes (`server/user.js`)
- Admin functionality (`server/admin.js`)
- Frontend components (`src/Login.jsx`, `src/Signup.jsx`)

## Dependencies

- mongoose: Database modeling
- bcryptjs: Password hashing
- crypto: Token generation (built-in Node.js module)

## Notes

- Passwords are automatically hashed using bcrypt with a salt factor of 10
- Password reset tokens expire after 1 hour
- Premium features are controlled through the subscription status
- Email verification is supported through the verification token system
