// MongoDB initialization script
db = db.getSiblingDB('whack-a-mole');

// Create user for the application
db.createUser({
  user: 'appuser',
  pwd: 'apppassword',
  roles: [
    {
      role: 'readWrite',
      db: 'whack-a-mole'
    }
  ]
});

// Create initial collection and add sample data
db.leaderboards.insertMany([
  {
    playerName: 'Player One',
    score: 1500,
    speed: 2.5,
    createdAt: new Date()
  },
  {
    playerName: 'Player Two',
    score: 1200,
    speed: 3.0,
    createdAt: new Date()
  },
  {
    playerName: 'Player Three',
    score: 900,
    speed: 1.8,
    createdAt: new Date()
  }
]);

print('Database initialized with sample data');