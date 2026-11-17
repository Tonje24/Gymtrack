// Express app with the GymTrack API routes.
// Kept separate from server.js so the tests can use it without starting a server.
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Checks that a new workout has all fields and sensible values
function validateWorkout(body) {
  const { exercise, sets, reps, weight, date } = body;
  if (!exercise || typeof exercise !== 'string' || exercise.trim() === '') {
    return 'Exercise is required';
  }
  if (!Number.isInteger(Number(sets)) || Number(sets) < 1) {
    return 'Sets must be a whole number of at least 1';
  }
  if (!Number.isInteger(Number(reps)) || Number(reps) < 1) {
    return 'Reps must be a whole number of at least 1';
  }
  if (weight === undefined || weight === '' || isNaN(Number(weight)) || Number(weight) < 0) {
    return 'Weight must be 0 or more';
  }
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return 'Date must be in the format YYYY-MM-DD';
  }
  return null;
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Get all workouts, newest first
app.get('/api/workouts', async (req, res) => {
  try {
    res.json(await db.getAll());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load workouts' });
  }
});

// Add a new workout
app.post('/api/workouts', async (req, res) => {
  const error = validateWorkout(req.body);
  if (error) {
    return res.status(400).json({ error });
  }
  try {
    const workout = await db.create({
      exercise: req.body.exercise.trim(),
      sets: Number(req.body.sets),
      reps: Number(req.body.reps),
      weight: Number(req.body.weight),
      date: req.body.date,
    });
    res.status(201).json(workout);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not save workout' });
  }
});

// Delete a workout by id
app.delete('/api/workouts/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  try {
    const deleted = await db.remove(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not delete workout' });
  }
});

module.exports = app;
