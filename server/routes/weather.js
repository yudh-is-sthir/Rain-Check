const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');

// GET /api/weather?city=<cityname> - Get weather data
router.get('/', requireAuth, async (req, res) => {
  const { city } = req.query;

  // Validate input
  if (!city) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'City parameter is required'
    });
  }

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: 'Configuration error',
        message: 'Weather API key not configured'
      });
    }

    // Fetch weather data from OpenWeatherMap API
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
      // Format and return weather data
      const weatherData = {
        city: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed
      };

      res.json(weatherData);
    } else {
      // Handle API errors
      res.status(response.status).json({
        error: 'Weather API error',
        message: data.message || 'Could not fetch weather data'
      });
    }
  } catch (error) {
    console.error('Weather fetch error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'An error occurred while fetching weather data'
    });
  }
});

module.exports = router;
