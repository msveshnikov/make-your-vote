# Admin Component Documentation

## Overview

The `Admin.jsx` component provides an administrative dashboard interface for managing topics, users,
and votes in the voting application. It's a protected route that displays statistics and allows
administrators to view and manage application data.

## Component Location

`src/Admin.jsx`

## Dependencies

```javascript
import React, { useState, useEffect } from 'react';
import { ... } from '@chakra-ui/react';
import { DeleteIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { API_URL } from './App';
import { useNavigate } from 'react-router-dom';
```

## State Management

```javascript
const [topics, setTopics] = useState([]);
const [users, setUsers] = useState([]);
const [votes, setVotes] = useState([]);
const [stats, setStats] = useState({
    totalUsers: 0,
    totalTopics: 0,
    totalVotes: 0
});
const [searchTerm, setSearchTerm] = useState('');
const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
const [itemToDelete, setItemToDelete] = useState({ id: null, type: null });
```

## Main Functions

### `fetchStats()`

Retrieves dashboard statistics from the server.

- **Returns**: Updates `stats` state with total counts of users, topics, and votes
- **Error Handling**: Displays toast notification on failure

### `fetchData()`

Fetches all topics, users, and votes data simultaneously.

- **Parameters**: None
- **Returns**: Updates respective state variables with fetched data
- **Error Handling**: Displays toast notification on failure

### `confirmDelete(id, type)`

Initiates the deletion process for an item.

- **Parameters**:
    - `id`: String - ID of the item to delete
    - `type`: String - Type of item ('topics', 'users', or 'votes')
- **Returns**: Opens confirmation dialog

### `handleDelete()`

Executes the deletion of the selected item.

- **Parameters**: None
- **Returns**: Removes item from database and updates UI
- **Error Handling**: Displays toast notification on failure

## UI Components

### Dashboard Statistics

- Displays cards showing total counts for:
    - Users
    - Topics
    - Votes

### Tab Panels

1. **Topics Tab**

    - Search functionality
    - Table displaying topic details
    - Progress bars for voting distribution
    - Delete functionality

2. **Users Tab**

    - Table of user information
    - Role badges
    - Delete functionality

3. **Votes Tab**
    - Table of voting history
    - Metadata display
    - Delete functionality

## Usage Example

```jsx
// In App.jsx or router configuration
<Route
    path="/admin"
    element={
        <ProtectedRoute>
            <Admin />
        </ProtectedRoute>
    }
/>
```

## Security Considerations

- Requires authentication token for API requests
- Should be protected by admin-only route middleware
- Includes confirmation dialogs for destructive actions

## Related Components

- Interacts with `Topic.jsx` for topic details
- Uses authentication context from `App.jsx`
- Connects to server endpoints defined in `server/admin.js`

## API Endpoints Used

```
GET    ${API_URL}/api/admin/dashboard
GET    ${API_URL}/api/topics
GET    ${API_URL}/api/users
GET    ${API_URL}/api/votes
DELETE ${API_URL}/api/{type}/{id}
```

## Error Handling

- Uses Chakra UI's toast system for error notifications
- Includes error boundaries for API requests
- Provides user feedback for all operations

## Future Improvements

1. Add pagination for large datasets
2. Implement filtering capabilities
3. Add user role management
4. Include data export functionality
5. Add audit logging for admin actions

This component is central to the application's administration and provides comprehensive management
capabilities for the entire platform.
