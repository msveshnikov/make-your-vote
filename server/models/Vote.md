# Vote Model Documentation

## Overview

The `Vote.js` file defines the Mongoose schema and model for votes in the application. It represents
user votes on topics with additional metadata and functionality for vote analysis. This model is a
crucial part of the server-side data structure, working in conjunction with the User and Topic
models.

## Schema Structure

### Core Fields

- **user** (ObjectId, required)
    - Reference to the User model
    - Represents the user who cast the vote
- **topic** (ObjectId, required)
    - Reference to the Topic model
    - Represents the topic being voted on
- **value** (Number, required)
    - Range: -1 to 1
    - Represents the vote value

### Vote Characteristics

- **sentiment** (String)
    - Possible values: 'positive', 'negative', 'neutral'
    - Default: 'neutral'
- **context** (String)
    - Optional contextual information
    - Maximum length: 1000 characters

### Metadata

- **metadata** (Object)
    ```javascript
    {
      device: String,
      location: {
        type: String,
        coordinates: [Number]
      },
      userAgent: String
    }
    ```

### Additional Properties

- **isAnonymous** (Boolean)

    - Default: false
    - Indicates if the vote was cast anonymously

- **timestamps**
    - `createdAt`: Automatically set on creation
    - `updatedAt`: Updated on each modification

## Indexes

```javascript
{ topic: 1, user: 1 }     // Unique compound index
{ topic: 1, createdAt: -1 }  // For topic-based queries
{ user: 1, createdAt: -1 }   // For user-based queries
```

## Static Methods

### getTopicStats(topicId)

Calculates voting statistics for a specific topic.

#### Parameters

- `topicId` (String|ObjectId): The ID of the topic

#### Returns

Promise that resolves to an object containing:

```javascript
{
  totalVotes: Number,
  positiveVotes: Number,
  negativeVotes: Number,
  neutralVotes: Number
}
```

## Middleware

### Pre-save Hook

Automatically updates the `updatedAt` timestamp before saving.

## Usage Examples

### Creating a New Vote

```javascript
const newVote = await Vote.create({
    user: userId,
    topic: topicId,
    value: 1,
    sentiment: 'positive',
    context: 'Supporting comment',
    metadata: {
        device: 'mobile',
        userAgent: 'Mozilla/5.0...'
    }
});
```

### Getting Topic Statistics

```javascript
const stats = await Vote.getTopicStats(topicId);
console.log(stats[0]); // First element contains the aggregated stats
```

## Integration

This model is used in conjunction with:

- `User.js` - For user reference and authentication
- `Topic.js` - For topic management and voting context
- Server endpoints handling vote operations

## Notes

- The schema uses timestamps for automatic date management
- Virtuals are enabled for both JSON and Object representations
- The model enforces unique votes per user per topic through indexing
- Geospatial data can be stored in the metadata.location field

This model is central to the voting functionality of the application, providing structured data
storage and analysis capabilities for user interactions with topics.
