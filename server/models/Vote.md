# Vote Model Documentation

## Overview

The `Vote.js` file defines the Mongoose schema and model for vote records in the application. This
model is crucial for storing and managing user votes on various topics, including metadata about the
vote context and user information.

## Schema Definition

### Core Fields

- **user**: ObjectId reference to the User model (optional)
- **topic**: ObjectId reference to the Topic model (required)
- **value**: Number between -1 and 1 (required)
- **sentiment**: String enum ('positive', 'negative', 'neutral'), defaults to 'neutral'
- **context**: String with max length of 1000 characters
- **isAnonymous**: Boolean flag, defaults to false

### Metadata Fields

The model includes extensive metadata collection:

```javascript
metadata: {
    device: String,
    location: {
        type: { type: String },
        coordinates: [Number]
    },
    userAgent: String,
    browserLanguage: String,
    countryCode: String (max 2 chars),
    countryName: String (max 100 chars),
    ip: String
}
```

### Timestamps

- **createdAt**: Date of vote creation
- **updatedAt**: Date of last vote update

## Indexes

The schema defines three indexes for optimized querying:

```javascript
voteSchema.index({ topic: 1, createdAt: -1 });
voteSchema.index({ user: 1, createdAt: -1 });
voteSchema.index({ countryCode: 1 });
```

## Static Methods

### getTopicStats(topicId)

Aggregates voting statistics for a specific topic.

#### Parameters

- `topicId`: MongoDB ObjectId of the topic

#### Returns

Promise resolving to an object containing:

- `totalVotes`: Total number of votes
- `positiveVotes`: Count of positive votes (value > 0)
- `negativeVotes`: Count of negative votes (value < 0)
- `neutralVotes`: Count of neutral votes (value = 0)

#### Example Usage

```javascript
const stats = await Vote.getTopicStats('topicId');
console.log(stats);
// Output: {
//   totalVotes: 100,
//   positiveVotes: 60,
//   negativeVotes: 30,
//   neutralVotes: 10
// }
```

## Middleware

### Pre-save Hook

Updates the `updatedAt` timestamp before saving:

```javascript
voteSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});
```

## Usage in Project Context

This model is used in conjunction with the `Topic` and `User` models to create a complete voting
system. It's typically used by:

- `Vote.jsx` component for submitting votes
- `Topic.jsx` component for displaying vote statistics
- Server-side routes for processing vote submissions and retrieving voting data

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

## Integration Points

- Connects with User model for voter tracking
- Connects with Topic model for vote aggregation
- Used by authentication middleware for vote validation
- Supports analytics and reporting features

## Best Practices

1. Always validate vote values (-1 to 1)
2. Handle anonymous votes appropriately
3. Consider privacy implications when storing metadata
4. Use indexes for performance optimization
5. Implement proper error handling when querying vote statistics

This model is fundamental to the application's voting functionality and provides robust support for
tracking, analyzing, and managing user votes across different topics.
