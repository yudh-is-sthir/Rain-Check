require('dotenv').config();
const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// Redis Client
let redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://redis:6379'
});
redisClient.on('error', err => console.log('Redis Client Error', err));
redisClient.connect().catch(console.error);

app.use(express.json());

// Session Middleware (Identical config to ensure session sharing)
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  name: 'sid', // Cookie name
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false, // Internal HTTP traffic
    domain: undefined // Allow sharing
  }
}));

// --- ROUTES ---

// Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  req.session.userId = user.id;
  req.session.username = user.username;

  res.json({ success: true, user: { id: user.id, username: user.username } });
});

// Logout
app.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Session Check (Internal use or Gateway use)
app.get('/status', (req, res) => {
  if (req.session.userId) {
    res.json({ authenticated: true, user: { id: req.session.userId, username: req.session.username } });
  } else {
    res.json({ authenticated: false });
  }
});

app.listen(PORT, () => {
  console.log(`🔐 Auth Service running on port ${PORT}`);
});
