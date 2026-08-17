# Use Node.js 20 LTS as base image
FROM node:20-alpine

# Install Chrome and dependencies
RUN apk add --no-cache \
        chromium \
        nss \
        freetype \
        harfbuzz \
        ttf-freefont \
        ttf-liberation

# Set Puppeteer to use the system Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the TypeScript application
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Use non-root user for security
USER node

# Start the application with npm start
CMD ["npm", "start"]