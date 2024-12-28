FROM oven/bun:1-slim as base
WORKDIR /app

# Install dependencies
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .
ENV VITE_GOOGLE_CLIENT_ID 769406280904-m0lsva6uvd96r5j5qcfk1ovbip47607k.apps.googleusercontent.com

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