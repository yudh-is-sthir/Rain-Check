FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies (including build tools for native modules like Better-Sqlite3)
RUN apk add --no-cache python3 make g++ && \
    npm install --production

COPY . .

CMD ["node", "index.js"]
