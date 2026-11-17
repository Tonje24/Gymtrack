// Database layer for GymTrack.
// If DATABASE_URL is set, workouts are stored in PostgreSQL.
// If not (for example in tests or on Cloud Run without a database),
// workouts are kept in memory so the app still works.
const useMemory = !process.env.DATABASE_URL;
let pool = null;
let memory = [];
let nextId = 1;

if (!useMemory) {
  const { Pool } = require('pg');
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
}

async function init() {
  if (useMemory) {
    console.log('No DATABASE_URL found, using in-memory storage');
    return;
  }
  await pool.query(`
    CREATE TABLE IF NOT EXISTS workouts (
      id SERIAL PRIMARY KEY,
      exercise TEXT NOT NULL,
      sets INTEGER NOT NULL,
      reps INTEGER NOT NULL,
      weight NUMERIC NOT NULL,
      date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('Connected to PostgreSQL');
}

async function getAll() {
  if (useMemory) {
    // Newest workouts first
    return [...memory].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
  }
  const result = await pool.query(
    "SELECT id, exercise, sets, reps, weight::float AS weight, to_char(date, 'YYYY-MM-DD') AS date FROM workouts ORDER BY date DESC, id DESC"
  );
  return result.rows;
}

async function create({ exercise, sets, reps, weight, date }) {
  if (useMemory) {
    const workout = { id: nextId++, exercise, sets, reps, weight, date };
    memory.push(workout);
    return workout;
  }
  const result = await pool.query(
    "INSERT INTO workouts (exercise, sets, reps, weight, date) VALUES ($1, $2, $3, $4, $5) RETURNING id, exercise, sets, reps, weight::float AS weight, to_char(date, 'YYYY-MM-DD') AS date",
    [exercise, sets, reps, weight, date]
  );
  return result.rows[0];
}

async function remove(id) {
  if (useMemory) {
    const before = memory.length;
    memory = memory.filter((w) => w.id !== id);
    return memory.length < before;
  }
  const result = await pool.query('DELETE FROM workouts WHERE id = $1', [id]);
  return result.rowCount > 0;
}

// Only used by the tests to start from an empty list
function reset() {
  memory = [];
  nextId = 1;
}

module.exports = { init, getAll, create, remove, reset };
