require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./db');

// Import routes
const authRoutes = require('./routes/auth');
const weatherRoutes = require('./routes/weather');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration - using MemoryStore for simplicity
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' // HTTPS only in production
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
