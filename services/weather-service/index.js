require('dotenv').config();
const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');
const { Queue } = require('bullmq');

const app = express();
const PORT = process.env.PORT || 3002;
const API_KEY = process.env.OPENWEATHER_API_KEY;

const redisOptions = { connection: { host: 'redis', port: 6379 } };
const weatherQueue = new Queue('weather-jobs', redisOptions);

// Redis Client (Shared)
let redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://redis:6379'
});
redisClient.connect().catch(console.error);

app.use(express.json());

// Session Middleware (READ ONLY INTENT)
// We use the exact same secret and cookie name so we can read the session set by Auth Service
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  name: 'sid'
}));

// Debug Middleware
app.use((req, res, next) => {
  console.log('--- DEBUG REQUEST ---');
  console.log('Headers:', req.headers);
  console.log('Session ID:', req.sessionID);
  console.log('User ID in Session:', req.session ? req.session.userId : 'No Session');
  next();
});

// Middleware: Require Auth
function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

app.get('/', requireAuth, async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: 'City required' });

  try {
    // In a real microservice, we would cache this response in Redis too!
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) throw new Error(data.message);

    res.json({
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      service: 'weather-service-v1' // Tagging reponse to prove it came from MS
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Batch Weather Request (Async)
app.post('/batch', requireAuth, async (req, res) => {
  const { cities } = req.body;
  if (!cities || !Array.isArray(cities)) return res.status(400).json({ error: 'Array of cities required' });

  const job = await weatherQueue.add('batch-process', {
    cities,
    userId: req.session.userId
  });

  res.json({ message: 'Batch processing started', jobId: job.id, status: 'queued' });
});

app.listen(PORT, () => {
  console.log(`🌤️  Weather Service running on port ${PORT}`);
});
