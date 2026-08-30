# VIA Backend — Production Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for layer caching)
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy all backend source code
COPY . .

# Expose port
EXPOSE 5001

# Start the server
CMD ["node", "server.js"]
