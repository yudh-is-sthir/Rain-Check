const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/auth/login - User login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Username and password are required'
    });
  }

  try {
    // Find user in database
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

    if (!user) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid username or password'
      });
    }

    // Check password (in production, use bcrypt!)
    if (user.password !== password) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid username or password'
      });
    }

    // Create session
    req.session.userId = user.id;
    req.session.username = user.username;

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'An error occurred during login'
    });
  }
});

// POST /api/auth/logout - User logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        error: 'Logout failed',
        message: 'Could not log out'
      });
    }
    res.json({
      success: true,
      message: 'Logout successful'
    });
  });
});

// GET /api/auth/status - Check authentication status
router.get('/status', (req, res) => {
  if (req.session && req.session.userId) {
    res.json({
      authenticated: true,
      user: {
        id: req.session.userId,
        username: req.session.username
      }
    });
  } else {
    res.json({ authenticated: false });
  }
});

module.exports = router;
