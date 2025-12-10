# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including build tools for better-sqlite3)
RUN apk add --no-cache python3 make g++ && \
    npm install

# Copy source code
COPY . .

# Production Stage
FROM node:20-alpine AS production

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN apk add --no-cache python3 make g++ && \
    npm install --production && \
    apk del python3 make g++

# Copy built application from builder stage
COPY --from=builder /app/server ./server
COPY --from=builder /app/public ./public
COPY --from=builder /app/database ./database

# Create volume for database peristence
VOLUME /app/database

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "start"]
