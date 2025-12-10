require('dotenv').config();
const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');
const path = require('path');
const db = require('./db');

// Import routes
const authRoutes = require('./routes/auth');
const weatherRoutes = require('./routes/weather');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Redis Client
let redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', err => console.log('Redis Client Error', err));
redisClient.connect().catch(console.error);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration - Using Redis
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/weather', weatherRoutes);

// Root route - serve login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log('🌦️  Rain-Check Server Started!');
  console.log(`📍 Server running at: http://localhost:${PORT}`);
  console.log(`🔐 Demo credentials: username="demo", password="password123"`);
  console.log(`⏹️  Press Ctrl+C to stop the server`);
});
