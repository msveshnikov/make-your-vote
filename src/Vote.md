# Vote Component Documentation

## Overview

The `Vote.jsx` component is a core feature of the MakeYour.vote application, providing a user
interface for creating and participating in binary choice voting topics. Built using React and
Chakra UI, this component handles the display of voting topics, vote submission, and creation of new
topics.

## Component Location

```
src/Vote.jsx
```

## Dependencies

- React (`useState`, `useEffect`)
- Chakra UI components and hooks
- React Icons (`FaVoteYea`, `FaPlus`)
- API_URL from App.jsx

## Theme Configuration

```javascript
const theme = extendTheme({
    config: {
        initialColorMode: 'light',
        useSystemColorMode: false
    }
});
```

Defines a light theme for consistent styling across the component.

## State Management

```javascript
const [topics, setTopics] = useState([]);
const [newTopic, setNewTopic] = useState({ optionA: '', optionB: '' });
```

## Core Functions

### `fetchTopics`

```javascript
const fetchTopics = async () => {
    // Fetches all voting topics from the API
};
```

- **Purpose**: Retrieves all voting topics from the backend
- **Returns**: Updates `topics` state with fetched data
- **Error Handling**: Displays error toast on failure

### `handleVote`

```javascript
const handleVote = async (topicId, option) => {
    // Submits a vote for a specific topic
};
```

- **Parameters**:
    - `topicId`: String - The ID of the voting topic
    - `option`: String - Either 'optionA' or 'optionB'
- **Returns**: Void
- **Error Handling**: Displays success/error toast

### `handleCreateTopic`

```javascript
const handleCreateTopic = async () => {
    // Creates a new voting topic
};
```

- **Purpose**: Submits new topic to the API
- **Uses**: `newTopic` state
- **Error Handling**: Displays success/error toast

## UI Components

### Main Layout

- Header with logo and "Create Topic" button
- List of voting topics
- Modal for creating new topics

### Topic Card

```jsx
<Box key={topic._id} w="full" p={6} borderRadius="lg" border="1px" borderColor="gray.200">
    // Topic display with voting buttons
</Box>
```

Displays individual topics with:

- Topic title
- Voting options as buttons
- Vote count badge

### Create Topic Modal

```jsx
<Modal isOpen={isOpen} onClose={onClose}>
    // Form for creating new topics
</Modal>
```

Contains:

- Two input fields for voting options
- Create button (disabled until both options are filled)

## Usage Example

```jsx
import Vote from './Vote';

function App() {
    return (
        <div>
            <Vote />
        </div>
    );
}
```

## Integration Points

- Connects to backend API endpoints:
    - GET `/api/topics` - Fetches topics
    - POST `/api/vote` - Submits votes
    - POST `/api/topics` - Creates new topics

## Error Handling

Uses Chakra UI's toast system for user feedback:

- Success messages for successful operations
- Error messages for failed API calls

## Future Improvements

- Real-time updates using WebSocket (commented code present)
- Pagination for topics list
- Vote validation
- User authentication integration

## Related Files

- `src/App.jsx` - Provides API_URL configuration
- `server/models/Topic.js` - Backend topic model
- `server/models/Vote.js` - Backend vote model

## Notes

- Ensure API_URL is properly configured in App.jsx
- Component requires Chakra UI provider in parent tree
- Designed for responsive layout
