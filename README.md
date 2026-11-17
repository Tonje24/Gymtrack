# GymTrack

A simple workout log web app for students and beginners. Log your workouts, look back at your history and see your progress over time.

**Live app:** https://gymtrack-frontend-157757292541.us-central1.run.app

## Problem

A lot of people start working out but lose motivation because they can't see their progress. Notes on your phone get messy fast, and many fitness apps are full of ads or cost money. GymTrack gives you one easy place to log workouts and see that you're getting stronger.

## Project Status

✅ **MVP (Sprint 1) – Unit 12**

| Feature | Status |
|---|---|
| Add a workout (exercise, sets, reps, weight, date) | ✅ Done |
| See all past workouts, newest first | ✅ Done |
| Delete a workout | ✅ Done |
| Run the whole app with Docker | ✅ Done |
| Deploy to Google Cloud Run | ✅ Manual deploy with Cloud Build |

🔜 **Final app (Sprint 2) – Unit 14**

- Edit a workout
- Filter workouts by exercise
- Weekly overview and progress view per exercise
- Personal best for each exercise
- CI/CD with GitHub Actions
- Cloud database so data is kept after a restart

## Tech Stack

| Part | Technology |
|---|---|
| Frontend | React (Vite), served by nginx |
| Backend | Node.js with Express |
| Database | PostgreSQL (in-memory fallback when no database is set) |
| Containers | Docker and docker-compose |
| Deployment | Google Cloud Run with Cloud Build |
| Project management | Jira and Confluence |

## Run the app with Docker

You need [Docker Desktop](https://www.docker.com/products/docker-desktop/).

```bash
git clone https://github.com/Tonje24/Gymtrack.git
cd Gymtrack
docker compose up --build
```

Then open:
- App: http://localhost:3000
- API: http://localhost:5000/api/workouts

Workouts are saved in PostgreSQL in a Docker volume, so they are still there after a restart.

## Run without Docker

**Backend**
```bash
cd backend
npm install
npm start
```
Without a `DATABASE_URL` the backend stores workouts in memory.

**Frontend** (in a new terminal)
```bash
cd frontend
npm install
npm run dev
```

## Run the tests

```bash
cd backend
npm install
npm test
```

## API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/workouts` | Get all workouts, newest first |
| POST | `/api/workouts` | Add a workout |
| DELETE | `/api/workouts/:id` | Delete a workout |

Example body for `POST /api/workouts`:
```json
{ "exercise": "Squat", "sets": 3, "reps": 8, "weight": 60, "date": "2026-11-16" }
```

## Deployment

Both services run on Google Cloud Run in `us-central1`. They are deployed manually with Cloud Build triggers:

- `cloudbuild-backend.yaml` builds and deploys `gymtrack-backend`
- `cloudbuild-frontend.yaml` builds and deploys `gymtrack-frontend` with the backend URL

On Cloud Run the backend has no database yet, so it uses in-memory storage. Workouts disappear when the service restarts. A cloud database is planned for Sprint 2.

## Git Workflow

Every feature was built on its own branch and merged into `main` with a pull request:

| Branch | What it added |
|---|---|
| `feature/backend-api` | Express API, validation and tests |
| `feature/frontend-ui` | React form, workout list and delete |
| `feature/docker-setup` | Dockerfiles, docker-compose and Cloud Build files |
| `docs/readme-update` | This README |

## AI Tool Usage

I used AI tools throughout the MVP:

| Tool | What I used it for |
|---|---|
| Claude | Planning the project structure, writing the Express API, the React components, the Dockerfiles and docker-compose, writing the backend tests, creating the feature branches and commits, and writing this README |
| GitHub Copilot | Suggested commit messages when editing files on GitHub. More use is planned for Sprint 2 |

Commits made with Claude are marked with `Co-Authored-By: Claude` in the commit message. I reviewed the code, tested it locally with Docker and merged every pull request myself.

## Links

- Jira: https://laasby.atlassian.net/jira/software/projects/SCRUM/boards/1
- Confluence: https://laasby.atlassian.net/wiki/spaces/G/overview
