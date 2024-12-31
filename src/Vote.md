# Vote Component Documentation

## Overview

The `Vote.jsx` component is a core feature of the voting application that allows users to view,
create, and vote on topics. It provides a responsive interface with support for pagination, image
management, and real-time vote tracking.

## Component Location

`src/Vote.jsx`

## Dependencies

- React and React hooks
- Chakra UI components
- React Router
- React Icons
- Axios

## State Management

```javascript
const [topics, setTopics] = useState([]); // Stores all voting topics
const [newTopic, setNewTopic] = useState({}); // Form data for new topics
const [loading, setLoading] = useState(false); // Loading state
const [currentPage, setCurrentPage] = useState(1); // Current page number
const [totalPages, setTotalPages] = useState(1); // Total available pages
const [votedTopics, setVotedTopics] = useState(new Set()); // Tracks user votes
const [user, setUser] = useState(null); // Current user data
```

## Main Functions

### `fetchTopics`

```javascript
const fetchTopics = useCallback(async () => {
    // Fetches paginated topics from the API
    // Parameters: None
    // Returns: void
});
```

### `handleVote`

```javascript
const handleVote = async (topicId, option) => {
    // Records a user's vote on a topic
    // Parameters:
    //   topicId: string - The ID of the topic
    //   option: number - Vote value (-1 for optionA, 1 for optionB)
    // Returns: void
});
```

### `handleCreateTopic`

```javascript
const handleCreateTopic = async () => {
    // Creates a new voting topic
    // Parameters: None
    // Returns: void
});
```

### `handleDeleteTopic`

```javascript
const handleDeleteTopic = async (topicId) => {
    // Deletes a topic (admin only)
    // Parameters:
    //   topicId: string - The ID of the topic to delete
    // Returns: void
});
```

### `handleRegenerateImage`

```javascript
const handleRegenerateImage = async (topicId, index) => {
    // Regenerates an option image (admin only)
    // Parameters:
    //   topicId: string - The ID of the topic
    //   index: number - Image index (-1 for optionA, 1 for optionB)
    // Returns: void
});
```

## Features

1. **Topic Display**

    - Responsive grid layout
    - Image display for options
    - Vote percentage visualization
    - Category badges
    - Total vote count

2. **User Interactions**

    - Voting on topics
    - Creating new topics
    - Sharing topics
    - Pagination navigation

3. **Admin Features**
    - Topic deletion
    - Image regeneration
    - User management

## Usage Example

```jsx
// In a parent component or route
import Vote from './Vote';

function App() {
    return (
        <Route path="/vote">
            <Vote />
        </Route>
    );
}
```

## Props

This component doesn't accept any props as it's self-contained and manages its own state.

## API Integration

- Connects to backend API defined in `API_URL`
- Endpoints used:
    - GET `/api/topics` - Fetch topics
    - POST `/api/topics` - Create topic
    - POST `/api/vote` - Record vote
    - DELETE `/api/topics/:id` - Delete topic
    - PUT `/api/topic/:id/image/:index` - Regenerate image

## Security

- Implements authentication checks for protected actions
- Uses JWT tokens for API requests
- Admin-only features are protected

## UI/UX Considerations

- Responsive design for mobile and desktop
- Loading states with progress indicators
- Toast notifications for user feedback
- Modal forms for topic creation
- Blur effects and animations for visual appeal

## Error Handling

- API error handling with user notifications
- Form validation
- Vote duplicate prevention
- Loading state management

## Related Components

- Connects with `App.jsx` for routing
- Integrates with authentication system
- Works alongside `Topic.jsx` for individual topic views

This component serves as the main interaction point for users to participate in voting activities
within the application.
