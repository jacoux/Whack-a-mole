# Whack-a-Mole Leaderboard

A full-stack application with Express.js backend, MongoDB database, and React frontend for managing whack-a-mole game leaderboards.

## Features

- **Backend**: Express.js with TypeScript, MongoDB with Mongoose
- **Frontend**: React with TypeScript
- **API Endpoints**: Complete CRUD operations for leaderboard
- **Docker**: Containerized application with MongoDB
- **Leaderboard**: Track player names, scores, and speed

## API Endpoints

- `GET /api/leaderboard` - Get all leaderboard entries
- `GET /api/leaderboard/top10` - Get top 10 leaders
- `GET /api/leaderboard/:id` - Get specific entry
- `POST /api/leaderboard` - Create new entry
- `PUT /api/leaderboard/:id` - Update entry
- `DELETE /api/leaderboard/:id` - Delete entry

## Running with Docker (Recommended)

1. Make sure Docker and Docker Compose are installed
2. Clone/navigate to the project directory
3. Run the entire stack:

```bash
docker-compose up --build
```

This will start:
- MongoDB on port 27017
- Backend API on port 5000
- Frontend on port 3000

Access the application at: http://localhost:3000

## Running in Development Mode

### Prerequisites
- Node.js 18+
- MongoDB running locally

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Project Structure

```
whack-a-mole/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   └── Leaderboard.ts
│   │   ├── routes/
│   │   │   └── leaderboard.ts
│   │   ├── services/
│   │   │   └── leaderboardService.ts
│   │   └── index.ts
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Leaderboard.tsx
│   │   │   └── Leaderboard.css
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── leaderboard.ts
│   │   └── App.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
├── mongo-init.js
└── README.md
```

## Stopping the Application

```bash
docker-compose down
```

To remove volumes as well:
```bash
docker-compose down -v
```