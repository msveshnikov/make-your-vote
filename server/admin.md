# Admin Routes Documentation

## Overview

The `admin.js` file defines administrative API routes for the application, handling user management,
topic control, voting data, and dashboard statistics. These routes are protected by authentication
middleware and restricted to users with admin privileges.

## Route Definitions

### Get All Users

```javascript
GET / api / users;
```

**Description:** Retrieves all users in the system (excluding password data)  
**Authentication:** Required  
**Admin Access:** Required  
**Response:** Array of user objects  
**Error Codes:** 500 (Internal Server Error)

### Get Recent Votes

```javascript
GET / api / votes;
```

**Description:** Retrieves the 50 most recent votes with populated topic data  
**Authentication:** Required  
**Admin Access:** Required  
**Response:** Array of vote objects  
**Error Codes:** 500 (Internal Server Error)

### Update Topic Image

```javascript
PUT /api/topic/:id/image/:option
```

**Description:** Regenerates image for a specific topic option using Unsplash API  
**Parameters:**

- `id`: Topic ID
- `option`: "-1" for optionA, any other value for optionB  
  **Authentication:** Required  
  **Admin Access:** Required  
  **Response:** Updated topic object  
  **Error Codes:**
- 404 (Topic Not Found)
- 500 (Failed to Regenerate Image)

### Delete Topic

```javascript
DELETE /api/topics/:id
```

**Description:** Deletes a topic and all associated votes  
**Parameters:**

- `id`: Topic ID  
  **Authentication:** Required  
  **Admin Access:** Required  
  **Response:** Success message  
  **Error Codes:**
- 404 (Topic Not Found)
- 500 (Internal Server Error)

### Get Admin Dashboard Data

```javascript
GET / api / admin / dashboard;
```

**Description:** Retrieves comprehensive dashboard statistics including:

- Total users, topics, and votes
- Top 5 voted topics
- 10 most recent votes  
  **Authentication:** Required  
  **Admin Access:** Required  
  **Response:** Dashboard statistics object  
  **Error Codes:** 500 (Internal Server Error)

### Update User Role

```javascript
PUT /api/users/:id/role
```

**Description:** Updates a user's role  
**Parameters:**

- `id`: User ID
- Request Body: `{ role: string }`  
  **Authentication:** Required  
  **Admin Access:** Required  
  **Response:** Updated user object  
  **Error Codes:**
- 404 (User Not Found)
- 500 (Internal Server Error)

### Delete User

```javascript
DELETE /api/users/:id
```

**Description:** Deletes a user and all associated votes  
**Parameters:**

- `id`: User ID  
  **Authentication:** Required  
  **Admin Access:** Required  
  **Response:** Success message  
  **Error Codes:**
- 404 (User Not Found)
- 500 (Internal Server Error)

## Dependencies

- `auth.js`: Provides authentication middleware
- `Topic.js`: Topic model
- `User.js`: User model
- `Vote.js`: Vote model
- `unsplash.js`: Unsplash API integration

## Usage Example

```javascript
// Initialize admin routes
import adminRoutes from './server/admin.js';
import express from 'express';

const app = express();
adminRoutes(app);
```

## Integration

This module is part of the server-side implementation and works in conjunction with the front-end
Admin component (`src/Admin.jsx`). It provides the necessary API endpoints for administrative
functions in the application.

## Security Notes

- All routes are protected by authentication middleware
- Admin privilege verification is enforced through the `isAdmin` middleware
- Sensitive data (passwords) is excluded from user queries
- Cascade deletion is implemented for related data
