# Use lightweight Node image
FROM node:20-alpine

WORKDIR /app

# Copy package files first (better layer caching)
COPY package*.json ./

# Install production deps only
RUN npm ci --only=production

# Copy source code
COPY . .

EXPOSE 8000

CMD ["node", "server.js"]
