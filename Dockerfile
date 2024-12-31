FROM oven/bun:1-slim as base
WORKDIR /app

# Install dependencies
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .
ENV VITE_GOOGLE_CLIENT_ID 1070314394225-li1vj0n39lsvb7b39knpb5lh5n938sqs.apps.googleusercontent.com

# Build the application
RUN bun run build

WORKDIR /app/server
COPY server/package*.json server/bun.lockb ./
RUN bun install --frozen-lockfile

WORKDIR /app
ENV NODE_ENV=production

# Expose the port
EXPOSE 3000

# Start the server
CMD ["bun", "server/index.js"]