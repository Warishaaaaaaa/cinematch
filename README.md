# 🎬 CineMatch — AI-Powered Movie Recommendation Platform

Find your next favorite movie. A full-stack, production-structured movie discovery app with a
rule-based recommendation engine, JWT authentication, favorites, watch history, and a premium
glassmorphic dark UI.

---

## ✨ Features

- **Landing page** — cinematic hero, feature grid, "how it works," CTA
- **One-question-at-a-time questionnaire** — mood, genre, language, runtime, era, favorite actor
- **AI-style recommendation engine** — transparent, rule-based scoring with a "why this matches you" explanation per movie
- **Discover / Search** — search any title, browse your personalized matches
- **Movie details modal** — poster, backdrop, cast, director, trailer link, match reasons
- **Auth** — register, login, logout, protected routes, JWT in HTTP-only cookies, bcrypt password hashing
- **Favorites & Watch History** — per-user, persisted in MongoDB
- **Profile dashboard** — stats, recently viewed, account info
- **Fully responsive** — desktop, tablet, mobile
- **Demo mode** — the app runs and looks fully alive even with zero API keys, using a built-in curated movie dataset. Add a real TMDb key any time to switch to live data with zero code changes.

---

## 🧱 Tech Stack

**Frontend:** React (Vite), Tailwind CSS, Framer Motion, React Router DOM, Axios, Lucide Icons
**Backend:** Node.js, Express.js
**Database:** MongoDB Atlas + Mongoose
**Auth:** JWT + bcryptjs + HTTP-only cookies
**External API:** TMDb (The Movie Database) — optional, with automatic mock-data fallback

---

## 📁 Project Structure

```
cinematch/
├── backend/
│   ├── config/            # DB connection
│   ├── controllers/       # Route handlers (auth, movies, recommend, favorites, history)
│   ├── middleware/        # JWT protect/optionalAuth, error handler
│   ├── models/            # Mongoose schemas: User, Favorite, History
│   ├── routes/            # Express routers
│   ├── services/          # tmdbService (+ mock data), recommendationEngine
│   ├── utils/              # generateToken
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── layout/     # Navbar, Footer
    │   │   ├── ui/         # GlassCard, ProgressBar, RatingBadge, skeletons
    │   │   ├── movie/      # MovieCard, MovieDetailsModal
    │   │   └── questionnaire/ # OptionCard
    │   ├── pages/          # LandingPage, Login, Register, Questionnaire, Discover,
    │   │                   # Favorites, History, Profile, About, NotFound
    │   ├── context/        # AuthContext
    │   ├── services/       # api.js, authService, movieService
    │   ├── utils/           # questionnaireData.js
    │   └── App.jsx
    └── .env.example
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB Atlas connection string (free tier is fine) — required for register/login/favorites/history
- (Optional) A free TMDb API key from https://www.themoviedb.org/settings/api — without it, the app
  automatically runs in **demo mode** with a curated built-in movie dataset. Search, recommendations,
  and details all still work.

### 1. Backend setup

```bash
cd backend
cp .env.example .env
# edit .env: paste your MONGO_URI, a random JWT_SECRET, and (optionally) TMDB_API_KEY
npm install
npm run dev
```

The API starts on `http://localhost:5000`. Visit `http://localhost:5000/api/health` to confirm it's running.

### 2. Frontend setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The app starts on `http://localhost:5173` and proxies `/api` requests to the backend automatically in dev.

### 3. Open the app

Go to `http://localhost:5173`, click **Start Exploring**, answer the quiz, and see your matches.
Register an account to save favorites and build watch history.

---

## 🔌 API Reference

| Method | Route                     | Access  | Description                                           |
| ------ | ------------------------- | ------- | ----------------------------------------------------- |
| POST   | `/api/auth/register`      | Public  | Create an account                                     |
| POST   | `/api/auth/login`         | Public  | Log in, sets JWT cookie                               |
| POST   | `/api/auth/logout`        | Private | Clear the session                                     |
| GET    | `/api/auth/profile`       | Private | Current user + stats                                  |
| POST   | `/api/recommend`          | Public  | Get ranked recommendations from questionnaire answers |
| GET    | `/api/movies/search?q=`   | Public  | Search movies by title                                |
| GET    | `/api/movies/:id`         | Public  | Full movie details (cast, trailer, etc.)              |
| GET    | `/api/movies/meta/genres` | Public  | Genre list for UI                                     |
| GET    | `/api/favorites`          | Private | List saved favorites                                  |
| POST   | `/api/favorites`          | Private | Save a movie                                          |
| DELETE | `/api/favorites/:movieId` | Private | Remove a favorite                                     |
| GET    | `/api/history`            | Private | List watch history                                    |
| POST   | `/api/history`            | Private | Log a viewed movie                                    |
| DELETE | `/api/history`            | Private | Clear history                                         |

---

## 🧠 How the recommendation engine works

`backend/services/recommendationEngine.js` scores every candidate movie against your questionnaire
answers using explicit, readable rules (mood → genre mapping, genre overlap, language match, runtime
fit, release-era fit, plus a light quality tiebreaker from the movie's rating). Each movie's final
match score and the specific reasons it scored well are returned to the frontend and shown directly
in the UI — nothing is hidden.

---

## 🛠️ Setting up MongoDB Atlas (required for signup/login/favorites/history)

The `.env` file ships with a **placeholder** connection string. Signup and login will not work
until you replace it with a real one. Free tier is enough:

1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account.
2. Create a free **M0 cluster** (any cloud provider/region is fine).
3. Under **Database Access**, add a database user with a username and password (save these).
4. Under **Network Access**, add an IP entry — for local development, `0.0.0.0/0` (allow from
   anywhere) is simplest; for production, restrict it to your server's IP.
5. Click **Connect** on your cluster → **Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Paste it into `backend/.env` as `MONGO_URI`, replacing `<username>` and `<password>` with the
   real values you created in step 3, and add `/cinematch` before the `?` so it targets a database
   named `cinematch`:
   ```
   MONGO_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/cinematch?retryWrites=true&w=majority
   ```
7. Also set `JWT_SECRET` in `backend/.env` to any long random string (e.g. run
   `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`).
8. Restart the backend (`npm run dev`). You should see `MongoDB Connected: ...` in the console —
   if you instead see a connection error, double-check the username/password and that your IP is
   allow-listed in step 4.

## 🎬 Setting up a TMDb API key (required for real movie search/details)

Without a key, the app runs in **demo mode** with a small built-in dataset (~24 movies), which is
why searching for most titles shows "not available." To unlock the full TMDb catalog:

1. Create a free account at https://www.themoviedb.org/signup.
2. Go to https://www.themoviedb.org/settings/api and request an API key (choose "Developer", fill
   in the short form — any personal-project description works).
3. Copy the **API Key (v3 auth)** value.
4. Paste it into `backend/.env` as `TMDB_API_KEY`, replacing `your_tmdb_v3_api_key_here`.
5. Restart the backend. Search and details will now hit live TMDb data automatically — no code
   changes needed.

---

## 🩺 Troubleshooting / what was fixed in this pass

- **Couldn't sign up or log in**: `MONGO_URI` was a placeholder, so the server couldn't reach a
  database. Requests would hang (or feel broken) waiting on a connection that never came. The
  connection now fails fast with a clear timeout, and auth/favorites/history routes now return an
  immediate, readable `503` error ("Database is not connected...") instead of hanging, until you
  set up MongoDB Atlas per the section above.
- **"Movie not available" on search**: `TMDB_API_KEY` was a placeholder, so search was only ever
  matching against the small offline demo dataset. Set up a real key per the section above.
- **Blank screen partway through the questionnaire**: the app had no error boundary, so any
  unexpected render error anywhere in the tree would unmount the whole page to blank white with no
  recovery. Added a global `ErrorBoundary` that now shows a friendly "Something went wrong" screen
  with a way back home instead. Also added a request timeout so a hung network call fails with a
  clear message instead of hanging indefinitely.
- **"Watch Demo" button**: removed from the landing page hero.


The modular structure (separate controllers/services/routes on the backend, isolated reusable
components on the frontend) is designed so these can be added without restructuring:

- AI chatbot for movie suggestions
- Similar-movie recommendations
- Personalized recommendations from watch history
- User reviews & ratings
- Social sharing of favorite lists
- Streaming availability
- Admin panel, email verification, password reset, notifications

---

## 🛠️ Recent fixes

- **TMDb key was silently ignored (fixed):** `server.js` used to call `dotenv.config()` *after* its own imports. Because ES module imports always resolve before the rest of a file runs, `tmdbService.js` was reading `process.env.TMDB_API_KEY` before it existed — so the app always fell back to the built-in demo movie set, even with a real key configured. Fixed by loading env vars via `import "dotenv/config"` as the very first line in `server.js`.
- **Questionnaire could feel stuck on the genre step (fixed):** the "selected" checkmark on option cards shared one Framer Motion `layoutId` across all cards. Selecting more than one genre at once (a normal thing to do on a multi-select step) violated that id's one-element assumption and could freeze the animation. Each card now animates independently.
- **Next/Back buttons could scroll out of view (fixed):** on the 9-option genre grid, the navigation buttons could end up below the fold on smaller screens, making it look like nothing happened when a selection was actually working fine. They're now pinned to the bottom of the viewport so they're always reachable.
- **"Database is not connected" on signup:** this one is an infrastructure issue, not a code bug — see **Troubleshooting** below.

## 🩺 Troubleshooting: "Database is not connected"

This message means Mongoose couldn't establish a connection to your `MONGO_URI` within a few seconds. Check, in order:

1. **Atlas Network Access (most common cause):** in your Atlas project, go to **Network Access** → **Add IP Address** → add `0.0.0.0/0` (allow from anywhere) while developing locally, or your machine's specific IP. A missing entry here causes exactly this error.
2. **Password has special characters:** if your MongoDB user's password contains characters like `@ # $ % & : /`, they must be URL-encoded in the connection string (e.g. `@` → `%40`). An unencoded special character breaks the URI silently.
3. **Cluster isn't paused:** free-tier Atlas clusters can auto-pause after inactivity. Open the Atlas dashboard and confirm the cluster shows as running.
4. **Confirm the URI is actually being read:** run `cd backend && node -e "require('dotenv').config(); console.log(process.env.MONGO_URI)"` and check it prints your real connection string, not `undefined`.
5. **DNS/SRV lookups blocked:** some networks/VPNs block the `mongodb+srv://` DNS SRV lookup. In Atlas → Connect → Drivers, there's usually a link to the non-SRV `mongodb://` connection string (lists each shard host directly) — try that instead if steps 1–4 check out and it's still failing.

Once `MONGO_URI` is reachable, restart the backend and register/login/favorites/history will work immediately — no code changes needed.
