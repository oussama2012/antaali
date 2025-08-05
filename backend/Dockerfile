# Use Node.js 18 LTS
FROM node:18-alpine

# Install security updates and curl for health checks
RUN apk update && apk upgrade && apk add --no-cache curl

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S antaali -u 1001 -G nodejs

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code and set ownership
COPY --chown=antaali:nodejs . .

# Build TypeScript
RUN npm run build

# Create uploads directory with proper permissions
RUN mkdir -p uploads && chown -R antaali:nodejs uploads

# Switch to non-root user
USER antaali

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start the application
CMD ["npm", "start"]
