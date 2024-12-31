# Vote Model Documentation

## Overview

The `Vote.js` file defines the Mongoose schema and model for handling voting data in the
application. This model is part of the server-side data structure, working alongside the User and
Topic models to manage voting functionality.

## Schema Definition

### Core Fields

| Field       | Type     | Description                                                    |
| ----------- | -------- | -------------------------------------------------------------- |
| user        | ObjectId | Reference to the User model (optional)                         |
| topic       | ObjectId | Required reference to the Topic model                          |
| value       | Number   | Required vote value between -1 and 1                           |
| sentiment   | String   | Vote sentiment: 'positive', 'negative', or 'neutral' (default) |
| context     | String   | Optional context for the vote (max 1000 characters)            |
| isAnonymous | Boolean  | Indicates if the vote was cast anonymously (default: false)    |

### Metadata Fields

The model includes detailed metadata capturing voting context:

```javascript
metadata: {
    device: String,
    location: {
        type: { type: String },
        coordinates: [Number]
    },
    userAgent: String,
    browserLanguage: String,
    countryCode: String,    // 2-character limit
    countryName: String,    // 100-character limit
    ip: String
}
```

### Timestamps

- `createdAt`: Automatically set when vote is created
- `updatedAt`: Updated whenever the vote is modified

## Indexes

```javascript
voteSchema.index({ topic: 1, createdAt: -1 });
voteSchema.index({ user: 1, createdAt: -1 });
voteSchema.index({ countryCode: 1 });
```

## Static Methods

### getTopicStats(topicId)

Calculates voting statistics for a specific topic.

#### Parameters

- `topicId` (String|ObjectId): The ID of the topic to analyze

#### Returns

Promise that resolves to an object containing:

- `totalVotes`: Total number of votes
- `positiveVotes`: Count of positive votes (value > 0)
- `negativeVotes`: Count of negative votes (value < 0)
- `neutralVotes`: Count of neutral votes (value = 0)

#### Example Usage

```javascript
const stats = await Vote.getTopicStats('topicId123');
console.log(stats);
// Output:
// [{
//   _id: null,
//   totalVotes: 100,
//   positiveVotes: 60,
//   negativeVotes: 30,
//   neutralVotes: 10
// }]
```

## Middleware

### Pre-save Hook

Automatically updates the `updatedAt` timestamp before saving:

```javascript
voteSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});
```

## Schema Options

```javascript
{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}
```

- Enables automatic timestamp management
- Includes virtual properties in JSON and Object conversions

## Integration with Project

This model is used in conjunction with:

- `server/index.js` for handling vote-related API endpoints
- `src/Vote.jsx` for frontend vote submission
- `server/middleware/auth.js` for vote authentication
- Works alongside `Topic.js` and `User.js` models for complete voting functionality

## Usage Example

```javascript
import Vote from './models/Vote.js';

// Creating a new vote
const newVote = new Vote({
    user: userId,
    topic: topicId,
    value: 1,
    sentiment: 'positive',
    context: 'Great initiative!',
    metadata: {
        device: 'mobile',
        countryCode: 'US'
    }
});

await newVote.save();

// Getting topic statistics
const topicStats = await Vote.getTopicStats(topicId);
```

## Security Considerations

- The model includes IP address storage for audit purposes
- Anonymous voting is supported through the `isAnonymous` flag
- Metadata collection should comply with privacy policies
- Location data is structured for GeoJSON compatibility
