# MakeYour.vote - Project Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Installation & Setup](#installation--setup)
4. [Module Descriptions](#module-descriptions)
5. [API Documentation](#api-documentation)
6. [Development Guide](#development-guide)
7. [Deployment](#deployment)
8. [Security Considerations](#security-considerations)

## Project Overview

MakeYour.vote is a platform designed to standardize and unify public opinion data. The system
provides real-time voting capabilities, AI-powered analysis, and enterprise-grade reporting tools.

### Key Features

- Real-time voting system
- AI-powered topic analysis
- User authentication
- Enterprise API access
- Data visualization
- Progressive Web App (PWA) support

### Market Opportunity

- Total Addressable Market (TAM): $308B
- Serviceable Addressable Market (SAM): $158B

## System Architecture

### Frontend Architecture

```
src/
├── components/
├── pages/
├── store/
├── hooks/
├── utils/
└── services/
```

### Backend Architecture

```
server/
├── models/
├── routes/
├── services/
├── middleware/
└── utils/
```

### Technology Stack

- **Frontend**: React.js, Vite, Chakra UI
- **Backend**: Node.js/Express, MongoDB
- **AI Services**: Claude, Gemini
- **Infrastructure**: Docker, Nginx
- **Real-time**: WebSocket/Socket.io

## Installation & Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/makeyour.vote.git
```

2. Install dependencies:

```bash
bun install
cd server && bun install
```

3. Configure environment variables:

```bash
cp .env.example .env
```

Required environment variables:

```
OPENAI_KEY=
GOOGLE_KEY=
CLAUDE_KEY=
GOOGLE_CLIENT_ID=
MONGODB_URI=
JWT_SECRET=
```

4. Start development servers:

```bash
# Frontend
bun run dev

# Backend
cd server && bun run dev
```

## Module Descriptions

### Frontend Modules

1. **App.jsx**

    - Main application container
    - Routing configuration
    - Global state management

2. **Landing.jsx**

    - Homepage component
    - Feature showcase
    - User onboarding

3. **Vote.jsx**
    - Voting interface
    - Real-time updates
    - Result visualization

### Backend Modules

1. **Topic.js**

    - Topic schema
    - CRUD operations
    - Validation logic

2. **User.js**

    - User management
    - Authentication
    - Profile handling

3. **Vote.js**
    - Vote tracking
    - Analytics
    - Real-time updates

## API Documentation

### Authentication Endpoints

```
POST /api/auth/login
POST /api/auth/register
GET /api/auth/profile
```

### Voting Endpoints

```
GET /api/topics
POST /api/topics
POST /api/vote
GET /api/results/:topicId
```

## Development Guide

### Code Style

- Uses Prettier for formatting
- ESLint for code quality
- Follow React best practices

### Testing

```bash
bun test
bun run test:e2e
```

### Building for Production

```bash
bun run build
```

## Deployment

### Docker Deployment

```bash
docker-compose up -d
```

### Manual Deployment

1. Build frontend:

```bash
bun run build
```

2. Start server:

```bash
cd server && bun start
```

## Security Considerations

1. **Authentication**

    - JWT-based authentication
    - Secure password hashing
    - Rate limiting

2. **Data Protection**

    - Input validation
    - XSS prevention
    - CSRF protection

3. **API Security**
    - API key authentication
    - Request validation
    - Rate limiting

## Monitoring & Analytics

1. **Performance Metrics**

    - Response times
    - Error rates
    - System resources

2. **User Analytics**
    - Voting patterns
    - User engagement
    - Feature usage

## Support & Maintenance

### Troubleshooting

1. Check logs:

```bash
docker-compose logs -f
```

2. Monitor system status:

```bash
docker stats
```

### Updates & Maintenance

- Regular dependency updates
- Security patches
- Performance optimization

## Contributing

1. Fork the repository
2. Create feature branch
3. Submit pull request
4. Follow code style guidelines

## License

This project is proprietary software. All rights reserved.

---

For additional support or questions, please contact support@makeyour.vote
