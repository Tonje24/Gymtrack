import { useEffect, useState } from 'react'

// The backend URL is set at build time. Locally it falls back to port 5000.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const today = () => new Date().toISOString().slice(0, 10)
const emptyForm = { exercise: '', sets: '', reps: '', weight: '', date: today() }

function App() {
  const [workouts, setWorkouts] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  // Load all workouts when the page opens
  useEffect(() => {
    loadWorkouts()
  }, [])

  async function loadWorkouts() {
    try {
      const res = await fetch(`${API_URL}/api/workouts`)
      if (!res.ok) throw new Error()
      setWorkouts(await res.json())
      setError('')
    } catch {
      setError('Could not load workouts. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    // Simple check before sending to the API
    if (!form.exercise.trim() || !form.sets || !form.reps || form.weight === '' || !form.date) {
      setError('Please fill in all fields.')
      return
    }
    try {
      const res = await fetch(`${API_URL}/api/workouts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Could not save workout.')
        return
      }
      setForm({ ...emptyForm, date: form.date })
      setError('')
      loadWorkouts()
    } catch {
      setError('Could not save workout. Is the backend running?')
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this workout?')) return
    try {
      const res = await fetch(`${API_URL}/api/workouts/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setWorkouts(workouts.filter((w) => w.id !== id))
    } catch {
      setError('Could not delete workout.')
    }
  }

  return (
    <div className="container">
      <header>
        <h1>🏋️ GymTrack</h1>
        <p>Log your workouts and see your progress.</p>
      </header>

      <section className="card">
        <h2>Add workout</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Exercise
            <input name="exercise" value={form.exercise} onChange={handleChange} placeholder="e.g. Squat" />
          </label>
          <div className="row">
            <label>
              Sets
              <input name="sets" type="number" min="1" value={form.sets} onChange={handleChange} />
            </label>
            <label>
              Reps
              <input name="reps" type="number" min="1" value={form.reps} onChange={handleChange} />
            </label>
            <label>
              Weight (kg)
              <input name="weight" type="number" min="0" step="0.5" value={form.weight} onChange={handleChange} />
            </label>
          </div>
          <label>
            Date
            <input name="date" type="date" value={form.date} onChange={handleChange} />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit">Save workout</button>
        </form>
      </section>

      <section className="card">
        <h2>My workouts ({workouts.length})</h2>
        {loading && <p>Loading...</p>}
        {!loading && workouts.length === 0 && (
          <p className="empty">No workouts yet. Add your first one above!</p>
        )}
        <ul className="workout-list">
          {workouts.map((w) => (
            <li key={w.id} className="workout">
              <div>
                <strong>{w.exercise}</strong>
                <span>{w.sets} x {w.reps} @ {w.weight} kg</span>
                <small>{w.date}</small>
              </div>
              <button className="delete" onClick={() => handleDelete(w.id)} aria-label={`Delete ${w.exercise}`}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default App
