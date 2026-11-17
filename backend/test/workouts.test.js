// Tests for the GymTrack workout API (uses in-memory storage)
delete process.env.DATABASE_URL;
const request = require('supertest');
const app = require('../app');
const db = require('../db');

const sample = { exercise: 'Squat', sets: 3, reps: 8, weight: 60, date: '2026-11-16' };

beforeEach(() => db.reset());

describe('GymTrack API', () => {
  test('GET /api/health returns healthy', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
  });

  test('GET /api/workouts returns an empty list at the start', async () => {
    const res = await request(app).get('/api/workouts');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('POST /api/workouts adds a workout', async () => {
    const res = await request(app).post('/api/workouts').send(sample);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(sample);
    expect(res.body.id).toBeDefined();
  });

  test('POST /api/workouts returns 400 when a field is missing', async () => {
    const res = await request(app).post('/api/workouts').send({ ...sample, exercise: '' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Exercise is required');
  });

  test('POST /api/workouts returns 400 for invalid sets', async () => {
    const res = await request(app).post('/api/workouts').send({ ...sample, sets: 0 });
    expect(res.status).toBe(400);
  });

  test('GET /api/workouts shows newest workouts first', async () => {
    await request(app).post('/api/workouts').send({ ...sample, date: '2026-11-01' });
    await request(app).post('/api/workouts').send({ ...sample, date: '2026-11-10' });
    const res = await request(app).get('/api/workouts');
    expect(res.body.map((w) => w.date)).toEqual(['2026-11-10', '2026-11-01']);
  });

  test('DELETE /api/workouts/:id removes a workout', async () => {
    const created = await request(app).post('/api/workouts').send(sample);
    const del = await request(app).delete(`/api/workouts/${created.body.id}`);
    expect(del.status).toBe(204);
    const list = await request(app).get('/api/workouts');
    expect(list.body).toEqual([]);
  });

  test('DELETE /api/workouts/:id returns 404 for a missing workout', async () => {
    const res = await request(app).delete('/api/workouts/999');
    expect(res.status).toBe(404);
  });
});
