// Dashboard page JavaScript

// DOM elements
const usernameDisplay = document.getElementById('username');
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const searchText = document.getElementById('search-text');
const searchSpinner = document.getElementById('search-spinner');
const logoutBtn = document.getElementById('logout-btn');
const errorMessage = document.getElementById('error-message');
const weatherContainer = document.getElementById('weather-container');

// Weather display elements
const cityName = document.getElementById('city-name');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weather-description');
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const condition = document.getElementById('condition');

// Weather icon mapping
const weatherIcons = {
  'Clear': '☀️',
  'Clouds': '☁️',
  'Rain': '🌧️',
  'Drizzle': '🌦️',
  'Thunderstorm': '⛈️',
  'Snow': '❄️',
  'Mist': '🌫️',
  'Smoke': '🌫️',
  'Haze': '🌫️',
  'Dust': '🌫️',
  'Fog': '🌫️',
  'Sand': '🌫️',
  'Ash': '🌫️',
  'Squall': '💨',
  'Tornado': '🌪️'
};

// Check authentication on page load
async function checkAuth() {
  try {
    const response = await fetch('/api/auth/status');
    const data = await response.json();

    if (!data.authenticated) {
      // Not logged in - redirect to login page
      window.location.href = '/';
      return;
    }

    // Display username
    usernameDisplay.textContent = data.user.username;
  } catch (error) {
    console.error('Auth check error:', error);
    window.location.href = '/';
  }
}

// Handle weather search
searchBtn.addEventListener('click', searchWeather);
cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchWeather();
  }
});

async function searchWeather() {
  const city = cityInput.value.trim();

  if (!city) {
    showError('Please enter a city name');
    return;
  }

  setLoading(true);
  hideError();

  try {
    const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
    const data = await response.json();

    if (response.ok) {
      // Display weather data
      displayWeather(data);
    } else {
      // Show error
      showError(data.message || 'Could not fetch weather data');
      setLoading(false);
    }
  } catch (error) {
    console.error('Weather fetch error:', error);
    showError('Network error. Please check your connection and try again.');
    setLoading(false);
  }
}

// Display weather data
function displayWeather(data) {
  cityName.textContent = `${data.city}, ${data.country}`;
  temperature.textContent = `${data.temperature}°C`;
  weatherDescription.textContent = data.description;
  feelsLike.textContent = `${data.feelsLike}°C`;
  humidity.textContent = `${data.humidity}%`;
  windSpeed.textContent = `${data.windSpeed} m/s`;
  condition.textContent = data.condition;

  // Set weather icon
  weatherIcon.textContent = weatherIcons[data.condition] || '🌡️';

  // Show weather container
  weatherContainer.classList.remove('hidden');
  setLoading(false);
}

// Handle logout
logoutBtn.addEventListener('click', async () => {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST'
    });

    if (response.ok) {
      // Logout successful - redirect to login
      window.location.href = '/';
    } else {
      showError('Logout failed. Please try again.');
    }
  } catch (error) {
    console.error('Logout error:', error);
    showError('Network error. Please try again.');
  }
});

// Show error message
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');

  // Auto-hide after 5 seconds
  setTimeout(() => {
    hideError();
  }, 5000);
}

// Hide error message
function hideError() {
  errorMessage.classList.add('hidden');
}

// Set loading state
function setLoading(isLoading) {
  searchBtn.disabled = isLoading;
  cityInput.disabled = isLoading;

  if (isLoading) {
    searchText.classList.add('hidden');
    searchSpinner.classList.remove('hidden');
  } else {
    searchText.classList.remove('hidden');
    searchSpinner.classList.add('hidden');
  }
}

// Initialize
checkAuth();
cityInput.focus();
