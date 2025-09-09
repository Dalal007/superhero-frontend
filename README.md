# Superhero Frontend

React + Vite frontend for exploring superheroes, building and comparing teams, and managing favourites. Styled with Tailwind CSS v4, state managed with Redux Toolkit, forms handled with Formik + Yup, and deployed behind Nginx via Docker.

## Features

- Authentication
  - Login/Register with client-side validation mirroring backend Joi
  - Redux state management with JWT token persistence
  - Protected routes and auth-dependent UI elements
- Heroes
  - Browse heroes with search and pagination
  - View hero detail with powerstats, biography, and appearance
  - Click-to-navigate from any hero card to detail page
- Favourites
  - Add/remove favorites when logged in
  - Favourites page lists saved heroes with navigation
  - Login redirect flow for unauthenticated favorite attempts
- Teams
  - Team Builder: balanced, power-focused, and random team recommendations
  - Team Compare: pick two teams, POST `/api/teams/compare`, and show predicted winner with explanation
- UI/UX
  - Responsive design for mobile, tablet, and desktop
  - Inline error banners (no alerts) and accessible UI patterns
  - Password visibility toggles on login/register forms
  - ESLint with React/Prettier

## Tech Stack

- React 18, React Router 6, Redux Toolkit, Formik + Yup
- Tailwind CSS v4 via `@tailwindcss/postcss`
- Vite 6
- Axios with auth token interceptor
- Docker (Nginx serving Vite build)

## Environment Variables

Create a `.env` file in the project root:

```
VITE_API_URL=http://localhost:5000/api
```

- Local dev: Vite injects `import.meta.env.VITE_API_URL` at build time
- Docker: `docker-compose.yml` reads `.env` and passes it through at build

## Installation (without Docker)

1) Install dependencies

```
npm install
```

2) Start the dev server

```
npm run dev
```

3) Open the application

```
http://localhost:5173/
```

4) Lint (optional)

```
npm run lint
npm run lint:fix
```

## Build (without Docker)

- Production build: `npm run build`
- Preview build locally: `npm run preview` (serves on a random port, shown in terminal)

## Running with Docker

Prerequisites: Docker and Docker Compose installed.

1) Set environment

- Ensure `.env` exists with `VITE_API_URL`

2) Start services

```
docker compose up -d --build
```

- Services
  - `frontend`: Nginx serving Vite build, maps container port 80 → host 5173

3) Open the application

```
http://localhost:5173/
```

4) Stop

```
docker compose down
```

## API Integration

Base URL: Configured via `VITE_API_URL` environment variable

- Auth
  - POST `/auth/register` { email, name, password }
  - POST `/auth/login` { email, password }
  - GET `/auth/me` (Authorization: Bearer <token>)
- Heroes
  - GET `/heroes` query: `q`, `page`, `limit`
  - GET `/heroes/:id`
  - PATCH `/heroes/:id` (role-based editing)
- Teams
  - GET `/teams/recommend` query: `type` one of `balanced|power|random`, `stat`, `size`
  - POST `/teams/compare` body: `{ teamA: string[], teamB: string[] }`
- Favorites
  - GET `/favorites` (auth)
  - POST `/favorites` body: `{ heroId }` (auth)
  - DELETE `/favorites/:id` (auth)

### Example: Login flow

```javascript
// Login form submission
const { data } = await api.post("/auth/login", { email, password });
localStorage.setItem("token", data.token);
// Token automatically included in subsequent requests via Axios interceptor
```

## Validation

- Client-side (Formik + Yup) in form components
  - Register: email, name, password rules (8–64 chars, upper/lowercase, digit, special)
  - Login: email and password required with same complexity rules
- Backend validation errors mapped to field-level display
- Duplicate-key and validation errors handled with inline error banners

## Project Scripts

- `npm run dev` — Start Vite dev server
- `npm run build` — Build production assets
- `npm run preview` — Preview built assets locally
- `npm run lint` — Run ESLint
- `npm run lint:fix` — Auto-fix where possible

## Styling and UI

- Tailwind v4 with `@import "tailwindcss";` and `@reference "tailwindcss";` in `src/index.css`
- Utility helpers:
  - `.container` — responsive container
  - `.card` — panel style
  - `.btn` — primary button
  - `.input` — form inputs
- Dark mode support via Tailwind classes
- Responsive grid layouts for hero cards and team displays

## File Structure

```
src/
  components/
  pages/
  store/
  ctx/
```

Key files:
- `src/main.jsx` — app entry, Redux Provider, auth initialization
- `src/store/authSlice.js` — Redux auth state and async thunks
- `src/api.js` — Axios instance with token interceptor
- `src/pages/` — route components (Browse, Login, Register, etc.)
- `src/components/Nav.jsx` — top navigation with auth state
- `Dockerfile`, `docker-compose.yml` — containerization

## Docker Notes

- Multi-stage build: Vite build in Node, served by Nginx
- `docker-compose.yml` maps container port 80 → host 5173
- Environment variables passed at build time for API URL configuration

## Troubleshooting

- CSS unknown utility errors
  - Confirm `src/index.css` includes `@import "tailwindcss";` and `@reference "tailwindcss";`
  - Ensure `postcss.config.js` uses `"@tailwindcss/postcss"` plugin
- API calls failing
  - Verify `VITE_API_URL` and that the backend is running and accessible from the browser/container
  - Check DevTools Network tab for CORS or 401s (token missing)
- Auth shows logged out incorrectly
  - Wait briefly on first load (auth initializes once). Token is read and `/auth/me` is called.
- Docker build uses wrong API URL
  - Ensure `.env` exists and rebuild: `docker compose up -d --build`
- Redux import errors
  - Run `npm install` to ensure `@reduxjs/toolkit` and `react-redux` are installed

## License

MIT
