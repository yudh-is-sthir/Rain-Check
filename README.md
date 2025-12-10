# Rain-Check 🌦️

A simple weather checking web application built to understand full-stack development from idea to deployment.

## Features
- 🔐 User Authentication (Login/Logout)
- 🌤️ Real-time Weather Data
- 📱 Responsive Design
- ✨ Modern UI with Glassmorphism

## Tech Stack
- **Backend:** Node.js + Express
- **Database:** SQLite3
- **Frontend:** HTML, CSS, JavaScript
- **API:** OpenWeatherMap

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd Rain-Check
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your OpenWeatherMap API key
```

4. Start the server
```bash
npm start
```

5. Open your browser and visit `http://localhost:3000`

### Default Login Credentials
- **Username:** demo
- **Password:** password123

## Project Structure
```
Rain-Check/
├── server/              # Backend code
│   ├── server.js        # Express server
│   ├── db.js            # Database setup
│   ├── routes/          # API routes
│   └── middleware/      # Custom middleware
├── public/              # Frontend code
│   ├── index.html       # Login page
│   ├── dashboard.html   # Weather dashboard
│   ├── css/             # Stylesheets
│   └── js/              # Client-side JavaScript
└── database/            # SQLite database

```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/status` - Check authentication status

### Weather
- `GET /api/weather?city=<cityname>` - Get weather data for a city

## License
MIT
