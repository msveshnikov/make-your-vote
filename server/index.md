# Server Documentation (server/index.js)

## Overview

This file serves as the main server implementation for a training exercise management application.
It provides a REST API with user authentication, exercise management, and AI-powered training
generation using OpenAI's GPT-4 model.

## Dependencies

- `express`: Web application framework
- `cors`: Cross-Origin Resource Sharing middleware
- `openai`: OpenAI API client
- `mongoose`: MongoDB ODM
- `jwt`: JSON Web Token authentication
- `bcryptjs`: Password hashing
- Additional security packages: `helmet`, `compression`, `rate-limit`

## Configuration

```javascript
const port = process.env.PORT || 3000;
```

Required environment variables:

- `OPENAI_KEY`: OpenAI API key
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing
- `PORT`: Server port (optional)

## Database Schemas

### UserSchema

```javascript
{
    email: String,          // Required, unique
    password: String,       // Required, hashed
    role: String,           // 'coach' or 'club'
    certifications: [String],
    experience: String,
    achievements: [String]
}
```

### ExerciseSchema

```javascript
{
    title: String,
    description: String,
    difficulty: String,
    ageGroup: String,
    category: String,
    videoUrl: String,
    restrictions: [String],
    createdBy: ObjectId    // Reference to User
}
```

## Middleware Functions

### authenticateToken

Validates JWT tokens for protected routes.

```javascript
const authenticateToken = (req, res, next) => {
    // ... token validation logic
};
```

## API Endpoints

### Authentication

#### POST /api/register

Creates a new user account.

- Body: `{ email, password, role }`
- Returns: `{ message: 'User created successfully' }` (201)

#### POST /api/login

Authenticates a user and returns a JWT.

- Body: `{ email, password }`
- Returns: `{ token: 'JWT_TOKEN' }` (200)

### Exercises

#### POST /api/generate-training

Generates training exercises using AI.

- Authentication: Required
- Body: `{ prompt }`
- Returns: `{ exercise: 'Generated content' }`

#### POST /api/exercises

Creates a new exercise.

- Authentication: Required
- Body: Exercise details
- Returns: Created exercise object (201)

#### GET /api/exercises

Retrieves all exercises.

- Authentication: Required
- Returns: Array of exercise objects

### Static File Serving

- Serves static files from the `../dist` directory
- Landing page: `/` serves `landing.html`
- All other routes serve `index.html` (SPA support)

## Security Features

1. Rate limiting: 100 requests per 15 minutes
2. Helmet security headers
3. Request size limiting (15mb)
4. CORS protection
5. Password hashing
6. JWT authentication

## Error Handling

- Global uncaught exception handler
- 404 handler for undefined routes
- Try-catch blocks for async operations

## Usage Example

```javascript
// Starting the server
npm start

// Making a request to create an exercise
fetch('/api/exercises', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        title: 'Exercise Name',
        description: 'Exercise Description',
        difficulty: 'Intermediate'
        // ... other fields
    })
});
```

## Project Context

This server file is part of a larger training management application. It works in conjunction with:

- Frontend SPA (`/src`)
- Landing page (`/public/landing.html`)
- Documentation (`/docs`)
- Docker deployment configuration

## Notes

- The server implements a RESTful API architecture
- Uses MongoDB for data persistence
- Implements security best practices
- Supports both development and production environments
- Includes compression for performance optimization
