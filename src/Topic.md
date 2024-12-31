# Topic Component Documentation

## Overview

The `Topic.jsx` component is a React component that displays and manages individual voting topics in
the application. It provides users with the ability to view topic details, cast votes between two
options, and share topics with others. The component is part of a larger voting application and
integrates with both a backend API and Google Analytics for tracking.

## Component Location

`src/Topic.jsx`

## Dependencies

- React and React Hooks (`useEffect`, `useState`)
- React Router (`useParams`, `Link`)
- Chakra UI components
- React GA4 for analytics
- React Icons

## State Management

```javascript
const [topic, setTopic] = useState(null); // Stores topic data
const [loading, setLoading] = useState(true); // Loading state
const [error, setError] = useState(null); // Error state
const [votedTopics, setVotedTopics] = useState(new Set()); // Tracks voted topics
```

## Main Functions

### `calculateVotePercentages(topic)`

Calculates the percentage distribution of votes between options.

**Parameters:**

- `topic`: Object containing vote counts

**Returns:**

- Object with percentage values for optionA and optionB

### `handleShare(topic)`

Manages topic sharing functionality using the Web Share API or fallback to clipboard.

**Parameters:**

- `topic`: Topic object to be shared

### `handleVote(topicId, option)`

Processes user votes and updates the UI accordingly.

**Parameters:**

- `topicId`: String - ID of the topic
- `option`: Number (-1 for optionA, 1 for optionB)

## API Interactions

- Fetches topic data from `${API_URL}/api/topic/${id}`
- Posts votes to `${API_URL}/api/vote`

## Features

1. **Voting System**

    - Binary choice voting (Option A vs Option B)
    - Vote percentage visualization
    - Prevention of duplicate votes
    - Local storage tracking of voted topics

2. **UI Components**

    - Progress indicators
    - Image display for options
    - Vote statistics
    - Share button
    - Navigation controls

3. **Analytics**
    - Tracks topic views
    - Tracks voting actions

## Usage Example

```jsx
// In a router configuration
<Route path="/topic/:id" element={<Topic />} />
```

## UI Structure

```
Container
└── Box
    └── VStack
        ├── Header (Title + Share Button)
        ├── Voting Options
        │   ├── Option A (Image + Button + Stats)
        │   └── Option B (Image + Button + Stats)
        └── Footer (Category + Vote Count)
```

## Error Handling

- Displays loading state during data fetch
- Shows error messages for failed API calls
- Provides user feedback via toast notifications

## Integration Points

- Connects with backend API for data fetching and vote submission
- Integrates with Google Analytics for user interaction tracking
- Uses local storage for vote tracking
- Implements Web Share API with clipboard fallback

## Notes

- Responsive design using Chakra UI
- Implements loading states and error handling
- Uses glass morphism effect for UI elements
- Includes accessibility features through ARIA labels
- Supports image lazy loading for performance

This component is central to the application's voting functionality and provides a complete user
interface for viewing and interacting with individual topics.
