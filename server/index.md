# Server Index.js Documentation

## Overview

This file serves as the main server entry point for a voting application. It sets up an Express.js
server with various middleware configurations, authentication, and API endpoints for user
management, voting, and topic handling.

## Dependencies

- Express.js - Web application framework
- MongoDB/Mongoose - Database and ODM
- JWT - Authentication
- Various security middleware (helmet, cors, rate-limiting)
- Compression and logging utilities

## Core Configuration

### Server Setup

```javascript
const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 3000;
```

### Middleware Configuration

- CORS enabled
- Helmet for security headers
- JSON body parsing (15mb limit)
- Static file serving with 3-day cache
- Request logging with Morgan
- Response compression
- Rate limiting (100 requests per 15 minutes)
- MongoDB connection

## Authentication

### `authenticateToken(req, res, next)`

Middleware for JWT authentication.

- **Parameters**:
    - `req` - Express request object
    - `res` - Express response object
    - `next` - Next middleware function
- **Returns**: Calls next() with authenticated user attached to request

## API Endpoints

### User Management

#### POST `/api/register`

Creates a new user account.

- **Body**: `{ email, password, role }`
- **Returns**: Status 201 on success

#### POST `/api/login`

Authenticates a user and returns a JWT token.

- **Body**: `{ email, password }`
- **Returns**: `{ token, user }` object

### Voting System

#### POST `/api/vote`

Records a user's vote.

- **Authentication**: Required
- **Body**: `{ topicId, vote }`
- **Returns**: Vote record

### Topic Management

#### POST `/api/topics`

Creates a new voting topic.

- **Authentication**: Required
- **Body**: `{ title, optionA, optionB, category }`
- **Returns**: Created topic

#### GET `/api/topics`

Retrieves latest 20 topics.

- **Authentication**: Not required
- **Returns**: Array of topics

### Static Routes

#### GET `/`

Serves the landing page.

#### GET `*`

Serves the main application page for all other routes.

## Utility Functions

### `cleanGeneratedCode(code)`

Cleans AI-generated code responses.

- **Parameters**: `code` - String containing code block
- **Returns**: Cleaned code string

### `generateTopicPairs()`

Generates initial voting topics using AI.

- **Returns**: void
- **Side Effects**: Creates topics in database

## Error Handling

- Global uncaught exception handler
- 404 handler for undefined routes
- Error responses in JSON format

## Usage Example

```javascript
// Start the server
npm run start

// Make a login request
fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
})
```

## Project Context

This server file is the backend foundation for a voting application. It interfaces with:

- Frontend React components in `/src`
- MongoDB models in `/server/models`
- AI integration through `gemini.js`
- Static assets in `/dist`

## Environment Requirements

- MongoDB URI
- JWT Secret
- Google Application Credentials
- Port (optional, defaults to 3000)

## Security Features

- Rate limiting
- CORS protection
- Helmet security headers
- JWT authentication
- Password hashing
- Request size limiting

This documentation provides a comprehensive overview of the server's functionality and its role in
the larger application architecture.
