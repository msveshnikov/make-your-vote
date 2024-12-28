# User Model Documentation

## Overview

The `User.js` file defines the Mongoose schema and model for user data in the application. This
model represents both coaches and club administrators, storing essential information like
authentication details, professional credentials, team associations, and system preferences.

## Schema Definition

### Basic Information

- **email** (String)

    - Required field
    - Must be unique
    - Automatically trimmed and converted to lowercase
    - Used for authentication and communication

- **password** (String)

    - Required field
    - Stores hashed password

- **role** (String)

    - Either 'coach' or 'club'
    - Defaults to 'coach'
    - Indexed for optimized queries

- **name** (String)
    - Optional
    - Trimmed to remove whitespace

### Professional Details

- **certifications** (Array of Strings)

    - List of professional certifications
    - Each entry is trimmed

- **experience** (String)

    - Professional experience description
    - Trimmed

- **achievements** (Array of Strings)
    - List of professional achievements
    - Each entry is trimmed

### Relationships and System Data

- **teams** (Array of ObjectIds)

    - References to Team documents
    - Establishes relationship with Team model

- **preferences** (Map)
    - Key-value store for user preferences
    - Values are strings
    - Defaults to empty object

### Analytics and System Metrics

- **analytics** (Object)
    - `lastLogin`: Date of last login
    - `loginCount`: Number of times logged in
    - `exercisesCreated`: Number of exercises created

### System Control

- **subscription** (String)

    - Either 'free' or 'premium'
    - Defaults to 'free'

- **permissions** (Array of Strings)
    - Available permissions:
        - 'create_exercise'
        - 'manage_team'
        - 'view_analytics'
        - 'admin'

### Timestamps

- **createdAt**: Automatically set on creation
- **updatedAt**: Automatically updated on modifications

## Usage Examples

### Creating a New User

```javascript
import User from './models/User.js';

const newUser = await User.create({
    email: 'coach@example.com',
    password: 'hashedPassword123',
    name: 'John Doe',
    role: 'coach',
    certifications: ['UEFA A License', 'Youth Coach Certificate'],
    experience: '10 years professional coaching experience'
});
```

### Querying Users

```javascript
// Find all coaches
const coaches = await User.find({ role: 'coach' });

// Find user by email
const user = await User.findOne({ email: 'coach@example.com' });

// Find users with specific certification
const qualifiedCoaches = await User.find({
    certifications: 'UEFA A License'
});
```

## Integration with Project

This model is central to the application's user management system and interacts with:

- Authentication/authorization flows
- Team management (referenced in `teams` array)
- Exercise creation and management
- Analytics tracking

## Schema Options

- Uses `timestamps: true` for automatic timestamp management
- Includes index on `role` field for optimized queries

## Notes

- Password should be hashed before saving
- Email uniqueness is enforced at the database level
- Role-based access control is implemented through the `role` and `permissions` fields

## Related Files

- `Team.js` - Referenced by the `teams` field
- Authentication middleware
- User routes and controllers

This model serves as the foundation for user management in the application, supporting both coach
and club administrator roles with their respective functionalities and permissions.
