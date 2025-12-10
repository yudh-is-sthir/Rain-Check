// Login page JavaScript

const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');
const loginBtn = document.getElementById('login-btn');
const loginText = document.getElementById('login-text');
const loginSpinner = document.getElementById('login-spinner');

// Handle form submission
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get form data
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  // Validate input
  if (!username || !password) {
    showError('Please enter both username and password');
    return;
  }

  // Show loading state
  setLoading(true);
  hideError();

  try {
    // Send login request
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      // Login successful - redirect to dashboard
      window.location.href = '/dashboard.html';
    } else {
      // Login failed - show error
      showError(data.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  } catch (error) {
    console.error('Login error:', error);
    showError('Network error. Please check your connection and try again.');
    setLoading(false);
  }
});

// Show error message
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
}

// Hide error message
function hideError() {
  errorMessage.classList.add('hidden');
}

// Set loading state
function setLoading(isLoading) {
  loginBtn.disabled = isLoading;

  if (isLoading) {
    loginText.classList.add('hidden');
    loginSpinner.classList.remove('hidden');
  } else {
    loginText.classList.remove('hidden');
    loginSpinner.classList.add('hidden');
  }
}

// Auto-focus username field
document.getElementById('username').focus();
