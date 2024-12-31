# User Model Documentation

## Overview

The `User.js` file defines the Mongoose schema and model for user management in the application. It
handles user authentication, subscription management, and various user-related functionalities. This
model is a crucial part of the server-side architecture, working alongside other models like Topic
and Vote.

## Schema Definition

### Fields

| Field Name           | Type    | Description                      | Properties                                 |
| -------------------- | ------- | -------------------------------- | ------------------------------------------ |
| email                | String  | User's email address             | Required, Unique, Trimmed, Lowercase       |
| password             | String  | Hashed user password             | Required                                   |
| firstName            | String  | User's first name                | Trimmed                                    |
| lastName             | String  | User's last name                 | Trimmed                                    |
| profilePicture       | String  | URL to user's profile picture    | Optional                                   |
| subscriptionStatus   | String  | User's subscription level        | Enum: ['free', 'premium'], Default: 'free' |
| subscriptionId       | String  | External subscription identifier | Optional                                   |
| createdAt            | Date    | Account creation timestamp       | Default: Current date                      |
| isAdmin              | Boolean | Administrator status             | Default: false                             |
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
async comparePassword(candidatePassword)
```

Compares a provided password with the stored hash.

- **Parameters**: `candidatePassword` (String)
- **Returns**: Promise<Boolean>

### generatePasswordResetToken

```javascript
generatePasswordResetToken();
```

Generates a password reset token and sets expiration.

- **Returns**: String (reset token)

### updatePreferences

```javascript
updatePreferences(newPreferences);
```

Updates user preferences.

- **Parameters**: `newPreferences` (Object)
- **Returns**: Promise<User>

### upgradeSubscription

```javascript
upgradeSubscription(subscriptionId);
```

Upgrades user to premium subscription.

- **Parameters**: `subscriptionId` (String)
- **Returns**: Promise<User>

### downgradeSubscription

```javascript
downgradeSubscription();
```

Downgrades user to free subscription.

- **Returns**: Promise<User>

### addVisitedCountry

```javascript
addVisitedCountry(countryCode, countryName);
```

Adds a country to user's visited countries list.

- **Parameters**:
    - `countryCode` (String)
    - `countryName` (String)
- **Returns**: Promise<User>

### canCreateAudioGuide

```javascript
canCreateAudioGuide();
```

Checks if user can create an audio guide based on timing restrictions.

- **Returns**: Boolean

## Usage Examples

### Creating a New User

```javascript
const newUser = new User({
    email: 'user@example.com',
    password: 'rawPassword', // Will be automatically hashed
    firstName: 'John',
    lastName: 'Doe'
});
await newUser.save();
```

### Authenticating a User

```javascript
const user = await User.findOne({ email: 'user@example.com' });
const isMatch = await user.comparePassword('providedPassword');
```

### Managing Subscriptions

```javascript
// Upgrade subscription
await user.upgradeSubscription('sub_123xyz');

// Downgrade subscription
await user.downgradeSubscription();
```

## Integration with Project

This model is used throughout the application, particularly in:

- Authentication middleware (`server/middleware/auth.js`)
- User routes (`server/user.js`)
- Admin functionality (`server/admin.js`)

The model supports both the web interface (React components in `src/`) and API endpoints, handling
user-related operations and access control.

## Security Considerations

- Passwords are automatically hashed using bcrypt
- Email verification system included
- Password reset functionality with secure token generation
- Subscription status validation
- Admin access control

## Dependencies

- mongoose
- bcryptjs
- crypto (Node.js built-in)

This documentation provides a comprehensive overview of the User model's capabilities and
integration within the project structure.
