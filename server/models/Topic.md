# Topic Model Documentation

## Overview

The `Topic.js` file defines the Mongoose schema and model for topics in the voting/polling
application. Located in `server/models/Topic.js`, this model represents the core data structure for
creating and managing voting topics or polls within the system.

## Schema Definition

### Basic Fields

| Field        | Type   | Description                       | Required |
| ------------ | ------ | --------------------------------- | -------- |
| title        | String | The main title of the topic/poll  | Yes      |
| optionA      | String | First voting option               | Yes      |
| optionB      | String | Second voting option              | Yes      |
| optionAImage | String | URL/path to image for option A    | No       |
| optionBImage | String | URL/path to image for option B    | No       |
| description  | String | Detailed description of the topic | No       |
| category     | String | Topic category                    | No       |

### Relationship Fields

| Field        | Type       | Description                                    |
| ------------ | ---------- | ---------------------------------------------- |
| creator      | ObjectId   | Reference to User model (creator of the topic) |
| allowedUsers | [ObjectId] | Array of User references for restricted access |

### Status and Control Fields

| Field      | Type   | Default   | Options                                    |
| ---------- | ------ | --------- | ------------------------------------------ |
| status     | String | 'pending' | 'active', 'closed', 'pending', 'moderated' |
| visibility | String | 'public'  | 'public', 'private', 'restricted'          |
| totalVotes | Number | 0         | -                                          |

### AI Analysis Fields

```javascript
aiAnalysis: {
    sentiment: String,      // 'positive', 'negative', 'neutral'
    keywords: [String],     // Array of keywords
    cluster: String,        // Clustering information
    moderationScore: Number // Content moderation score
}
```

### Temporal Fields

- `startDate`: Date when the topic becomes active (defaults to creation time)
- `endDate`: Optional date when the topic closes
- `timestamps`: Automatically tracks createdAt and updatedAt

### Metadata

```javascript
metadata: {
    source: String,        // Source of the topic
    externalId: String,    // External reference ID
    lastAnalyzed: Date,    // Last AI analysis timestamp
    lastModerated: Date    // Last moderation timestamp
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

- `votes`: Virtual population of associated votes from the Vote model

## Usage Examples

### Creating a New Topic

```javascript
import Topic from '../models/Topic.js';

const newTopic = await Topic.create({
    title: 'Which is better?',
    optionA: 'Coffee',
    optionB: 'Tea',
    description: 'Help settle this age-old debate',
    category: 'Food & Drink',
    creator: userId
});
```

### Querying Topics

```javascript
// Find active public topics
const activeTopics = await Topic.find({
    status: 'active',
    visibility: 'public'
})
    .populate('creator')
    .sort('-createdAt');

// Search topics by text
const searchResults = await Topic.find(
    { $text: { $search: 'coffee' } },
    { score: { $meta: 'textScore' } }
).sort({ score: { $meta: 'textScore' } });
```

## Integration

This model interacts with:

- `User.js` model through creator and allowedUsers references
- `Vote.js` model through the virtual votes field
- Authentication middleware for access control
- Admin routes for moderation
- Frontend Topic.jsx component for display and interaction

## Notes

- Implements soft moderation through status field
- Supports flexible access control through visibility settings
- Includes AI analysis capabilities for content moderation
- Uses timestamps for audit trailing
- Supports text search functionality

This model serves as the foundation for the application's topic management system, enabling voting,
moderation, and analysis features while maintaining data integrity and performance through strategic
indexing.
