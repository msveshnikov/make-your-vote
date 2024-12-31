# Topic Model Documentation

## Overview

The `Topic.js` file defines the Mongoose schema and model for topics in the application. Topics
represent discussion or voting items where users can choose between two options (A and B). This
model is a core component of the application's data structure, used alongside User and Vote models.

## Schema Structure

### Basic Fields

- **title** (String, required)

    - The main title of the topic
    - Trimmed automatically

- **optionA** and **optionB** (String, required)

    - The two voting options users can choose between
    - Trimmed automatically

- **optionAImage** and **optionBImage** (String)

    - Optional image URLs for each option
    - Trimmed automatically

- **description** (String)
    - Additional details about the topic
    - Trimmed automatically

### Metadata Fields

- **category** (String)

    - Topic classification category

- **creator** (ObjectId)

    - Reference to the User model
    - Identifies who created the topic

- **status** (String)
    - Values: 'active', 'closed', 'pending', 'moderated'
    - Default: 'pending'

### AI Analysis Fields

```javascript
aiAnalysis: {
    sentiment: String,     // 'positive', 'negative', 'neutral'
    keywords: [String],    // Array of relevant keywords
    cluster: String,       // Clustering information
    moderationScore: Number // Content moderation score
}
```

### Timing Fields

- **startDate** (Date)

    - When the topic becomes active
    - Defaults to creation time

- **endDate** (Date)
    - Optional end date for the topic

### Access Control

- **visibility** (String)

    - Values: 'public', 'private', 'restricted'
    - Default: 'public'

- **allowedUsers** (Array of ObjectIds)
    - References to User model
    - Specifies users with access to restricted topics

### Additional Features

- **totalVotes** (Number)

    - Counter for total votes cast
    - Default: 0

- **tags** (Array of Strings)
    - Keywords or categories for topic classification

## Virtual Fields

```javascript
votes: {
    ref: 'Vote',
    localField: '_id',
    foreignField: 'topic'
}
```

- Creates a virtual connection to associated votes

## Indexes

```javascript
// Text search indexes
topicSchema.index({ title: 'text', description: 'text' });

// Performance optimization indexes
topicSchema.index({ category: 1, status: 1 });
topicSchema.index({ creator: 1 });
```

## Usage Examples

### Creating a New Topic

```javascript
import Topic from '../models/Topic.js';

const newTopic = await Topic.create({
    title: 'Which is better?',
    optionA: 'Coffee',
    optionB: 'Tea',
    description: 'Morning beverage preference',
    category: 'Food & Drink',
    creator: userId,
    visibility: 'public'
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
    .populate('votes');

// Search topics by text
const searchResults = await Topic.find(
    { $text: { $search: 'coffee' } },
    { score: { $meta: 'textScore' } }
).sort({ score: { $meta: 'textScore' } });
```

## Integration Points

- Used by server-side routes for topic management
- Referenced in Vote model for vote tracking
- Interacts with User model for creator and access control
- Supports AI analysis features through the aiAnalysis field

## Notes

- Implements timestamps for created/updated tracking
- Includes virtuals in JSON/Object conversion
- Uses trim on string fields for data cleanliness
- Supports complex access control through visibility and allowedUsers
- Enables efficient searching through text and compound indexes

This model is central to the application's functionality, managing the core content that users
interact with and vote on.
