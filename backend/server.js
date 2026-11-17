// Starts the GymTrack API server
const app = require('./app');
const db = require('./db');

const PORT = process.env.PORT || 5000;

db.init()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`GymTrack API running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start:', err);
    process.exit(1);
  });
