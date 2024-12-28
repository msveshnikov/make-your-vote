# Topic Model Documentation

## Overview

The `Topic.js` file defines the Mongoose schema and model for topics in the voting application.
Topics represent the main voting items that users can create and vote on. This model is a crucial
part of the server-side data structure, interacting with both User and Vote models.

## Schema Definition

### Basic Fields

| Field       | Type     | Description                       | Required | Default |
| ----------- | -------- | --------------------------------- | -------- | ------- |
| title       | String   | The main title of the topic       | Yes      | -       |
| optionA     | String   | First voting option               | Yes      | -       |
| optionB     | String   | Second voting option              | Yes      | -       |
| description | String   | Detailed description of the topic | No       | -       |
| category    | String   | Topic category                    | Yes      | -       |
| creator     | ObjectId | Reference to User model           | No       | -       |

### Status and Metadata

| Field      | Type   | Description                | Default      | Options                            |
| ---------- | ------ | -------------------------- | ------------ | ---------------------------------- |
| status     | String | Current state of the topic | 'pending'    | active, closed, pending, moderated |
| startDate  | Date   | Topic creation date        | Current date | -                                  |
| endDate    | Date   | Topic closing date         | -            | -                                  |
| totalVotes | Number | Total vote count           | 0            | -                                  |

### AI Analysis

```javascript
aiAnalysis: {
    sentiment: String (enum: ['positive', 'negative', 'neutral']),
    keywords: [String],
    cluster: String,
    moderationScore: Number
}
```

### Access Control

| Field        | Type       | Description       | Default  | Options                     |
| ------------ | ---------- | ----------------- | -------- | --------------------------- |
| visibility   | String     | Access level      | 'public' | public, private, restricted |
| allowedUsers | [ObjectId] | Users with access | -        | -                           |

### Additional Metadata

```javascript
metadata: {
    source: String,
    externalId: String,
    lastAnalyzed: Date,
    lastModerated: Date
}
```

## Indexes

```javascript
// Text search indexes
topicSchema.index({ title: 'text', description: 'text' });

// Performance indexes
topicSchema.index({ category: 1, status: 1 });
topicSchema.index({ creator: 1 });
```

## Virtual Fields

- `votes`: References the Vote model to get all votes associated with the topic

## Schema Options

```javascript
{
    timestamps: true,  // Adds createdAt and updatedAt fields
    toJSON: { virtuals: true },  // Includes virtual fields in JSON
    toObject: { virtuals: true }
}
```

## Usage Examples

### Creating a New Topic

```javascript
const newTopic = await Topic.create({
    title: 'Sample Topic',
    optionA: 'Yes',
    optionB: 'No',
    description: 'Description text',
    category: 'social',
    creator: userId,
    visibility: 'public'
});
```

### Querying Topics

```javascript
// Get active public topics
const activeTopics = await Topic.find({
    status: 'active',
    visibility: 'public'
}).populate('creator');

// Search topics by text
const searchResults = await Topic.find({ $text: { $search: 'keyword' } });
```

## Integration

This model works in conjunction with:

- `User.js`: Referenced in creator and allowedUsers fields
- `Vote.js`: Connected through the virtual 'votes' field
- Server endpoints for topic creation, management, and retrieval
- AI analysis services (via claude.js and gemini.js)

## Notes

- The schema includes support for AI analysis and moderation
- Flexible visibility controls for public, private, and restricted access
- Built-in text search capabilities
- Optimized indexes for common query patterns

For more detailed implementation examples and API endpoints, refer to the server-side route handlers
and controllers.
