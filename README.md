# Superhero Frontend

React + Vite frontend for exploring superheroes, building and comparing teams, and managing favourites. Styled with Tailwind CSS v4, state managed with Redux Toolkit, forms handled with Formik + Yup, and deployed behind Nginx via Docker.

## Features

### 🔐 Authentication & User Management
- **User Registration & Login**
  - Secure registration with comprehensive validation (name, email, password)
  - Login with email/password authentication
  - Password complexity requirements (8-64 chars, uppercase, lowercase, digit, special character)
  - Password visibility toggle for better UX
  - JWT token-based authentication with automatic persistence
  - Redux state management for user session
  - Protected routes with role-based access control

- **Role-Based Access Control**
  - **Viewer**: Basic access to browse heroes and view details
  - **Editor**: Can edit hero information and manage favorites
  - **Admin**: Full access including user management and all features
  - Dynamic UI elements based on user role
  - Automatic redirect to login for protected actions

- **Admin Panel**
  - Comprehensive user management interface
  - Search and filter users by name, email, role
  - Sort users by various criteria (name, email, role, join date)
  - Update user roles with dropdown selection
  - Delete users (with confirmation)
  - Advanced pagination with customizable page sizes
  - Real-time updates and error handling

### 🦸 Hero Management
- **Hero Browser**
  - Search heroes by name with real-time filtering
  - Paginated display (24 heroes per page)
  - Responsive grid layout (2-6 columns based on screen size)
  - Hero cards with image, name, and publisher information
  - Click-to-navigate to detailed hero pages

- **Hero Detail Pages**
  - Comprehensive hero information display
  - **Power Stats**: Intelligence, Strength, Speed, Durability, Power, Combat
  - **Biography**: Full name, alter egos, aliases, place of birth, first appearance, publisher, alignment
  - **Appearance**: Gender, race, height, weight, eye color, hair color
  - **Work**: Occupation and base of operations
  - **Connections**: Group affiliation and relatives
  - **Edit History**: Shows last updated by whom and when (for editors/admins)
  - Add/remove from favorites functionality
  - Role-based hero editing capabilities

- **Hero Editing (Editors & Admins)**
  - Comprehensive edit form with validation
  - Edit all hero attributes including power stats, biography, appearance, work, and connections
  - Form validation with Yup schema
  - Real-time error handling and feedback
  - Modal-based editing interface
  - Automatic data refresh after successful edits

### ⭐ Favorites System
- **Personal Favorites**
  - Add/remove heroes from personal favorites list
  - Favorites page with grid display of saved heroes
  - Login redirect flow for unauthenticated favorite attempts
  - Automatic favorite status detection on hero detail pages
  - Seamless integration with authentication system

### 🏆 Team Building & Comparison
- **Team Builder**
  - **Balanced Teams**: Mix of good, bad, and neutral alignment heroes
  - **Power-Focused Teams**: Optimized for specific power stats (intelligence, strength, speed, durability, power, combat)
  - **Random Teams**: Completely randomized team compositions
  - 5-hero team recommendations
  - Real-time team generation with refresh capability
  - Visual team display with hero cards and alignment indicators

- **Team Comparison**
  - **Dual Team Selection**: Search and select heroes for two separate teams
  - **Real-time Search**: Debounced search with 300ms delay for optimal performance
  - **Team Management**: Add/remove heroes with visual feedback
  - **Battle Simulation**: POST to `/api/teams/compare` for AI-powered team comparison
  - **Results Display**: Winner prediction with detailed explanations
  - **Authentication Required**: Login protection for comparison features
  - **Error Handling**: Comprehensive error messages and fallback states

### 🎨 User Interface & Experience
- **Responsive Design**
  - Mobile-first approach with breakpoints for tablet and desktop
  - Adaptive grid layouts (2-6 columns based on screen size)
  - Touch-friendly interface elements
  - Optimized for all device types

- **Modern UI Components**
  - Tailwind CSS v4 with custom utility classes
  - Dark mode support with system preference detection
  - Smooth transitions and hover effects
  - Loading states with spinners and skeleton screens
  - Inline error banners (no intrusive alerts)
  - Accessible form controls and navigation

- **Navigation & Routing**
  - React Router 6 with protected routes
  - Sticky navigation header with backdrop blur
  - Role-based navigation menu items
  - Breadcrumb-style navigation for better UX
  - 404 error page with helpful recovery options

- **Form Handling**
  - Formik + Yup for form management and validation
  - Real-time validation feedback
  - Password visibility toggles
  - Comprehensive error handling with field-level errors
  - Loading states during form submission

### 🔧 Technical Features
- **State Management**
  - Redux Toolkit for global state management
  - Async thunks for API calls
  - Persistent authentication state
  - Optimistic updates where appropriate

- **API Integration**
  - Axios with automatic token injection
  - Request/response interceptors
  - Comprehensive error handling
  - Environment-based API URL configuration

- **Performance Optimizations**
  - Debounced search inputs
  - Lazy loading of components
  - Optimized re-renders with React hooks
  - Efficient pagination and data loading

- **Code Quality**
  - ESLint with React/Prettier configuration
  - Consistent code formatting
  - TypeScript-ready structure
  - Modular component architecture

## Key Capabilities

### 🎯 Core Functionality
- **Hero Database**: Comprehensive superhero database with detailed information
- **Smart Search**: Real-time hero search with debounced input for optimal performance
- **Team Strategy**: Multiple team building strategies (balanced, power-focused, random)
- **Battle Simulation**: AI-powered team comparison with detailed explanations
- **User Management**: Complete user lifecycle with role-based permissions
- **Content Management**: Hero editing capabilities for authorized users

### 🔒 Security Features
- **JWT Authentication**: Secure token-based authentication with automatic persistence
- **Role-Based Access**: Three-tier permission system (Viewer, Editor, Admin)
- **Protected Routes**: Automatic redirects for unauthorized access attempts
- **Input Validation**: Comprehensive client and server-side validation
- **Secure API**: All sensitive operations require authentication

### 📱 User Experience
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Progressive Enhancement**: Works without JavaScript for basic functionality
- **Accessibility**: WCAG-compliant form controls and navigation
- **Performance**: Optimized loading with pagination and lazy loading
- **Error Handling**: User-friendly error messages and recovery options

## Tech Stack

### Frontend Framework
- **React 18** — Modern React with hooks and concurrent features
- **React Router 6** — Client-side routing with protected routes
- **Redux Toolkit** — Predictable state management with async thunks
- **Formik + Yup** — Form handling with comprehensive validation

### Styling & UI
- **Tailwind CSS v4** — Utility-first CSS framework with custom components
- **PostCSS** — CSS processing with autoprefixer
- **Responsive Design** — Mobile-first approach with breakpoint system
- **Dark Mode** — System preference detection and manual toggle

### Build & Development
- **Vite 6** — Fast build tool with HMR and optimized bundling
- **ESLint** — Code linting with React and accessibility rules
- **Prettier** — Consistent code formatting
- **Docker** — Containerized deployment with Nginx

### API & Data
- **Axios** — HTTP client with interceptors and error handling
- **JWT** — JSON Web Tokens for authentication
- **RESTful API** — Standard REST endpoints with proper HTTP methods

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

### Authentication Endpoints
- **POST** `/auth/register` - User registration
  - Body: `{ email, name, password }`
  - Returns: `{ user, token }`
- **POST** `/auth/login` - User login
  - Body: `{ email, password }`
  - Returns: `{ user, token }`
- **GET** `/auth/me` - Get current user info
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ user }`

### Hero Management Endpoints
- **GET** `/heroes` - Browse heroes with search and pagination
  - Query params: `q` (search), `page`, `limit`
  - Returns: `{ items: Hero[], total: number, page: number, limit: number }`
- **GET** `/heroes/:id` - Get hero details
  - Returns: Complete hero object with all attributes
- **PATCH** `/heroes/:id` - Update hero information (Editor/Admin only)
  - Headers: `Authorization: Bearer <token>`
  - Body: Partial hero object with updated fields
  - Returns: Updated hero object

### Team Building Endpoints
- **GET** `/teams/recommend` - Get team recommendations
  - Query params: `type` (balanced|power|random), `stat` (for power type), `size`
  - Returns: `{ team: Hero[] }`
- **POST** `/teams/compare` - Compare two teams (Authenticated only)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ teamA: string[], teamB: string[] }` (hero IDs)
  - Returns: `{ winner: string, explanation: string }`

### Favorites Endpoints
- **GET** `/favorites` - Get user's favorite heroes (Authenticated only)
  - Headers: `Authorization: Bearer <token>`
  - Returns: `Hero[]`
- **POST** `/favorites` - Add hero to favorites (Authenticated only)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ heroId: string }`
  - Returns: Success confirmation
- **DELETE** `/favorites/:id` - Remove hero from favorites (Authenticated only)
  - Headers: `Authorization: Bearer <token>`
  - Returns: Success confirmation

### Admin Endpoints
- **GET** `/admin/users` - Get users list (Admin only)
  - Headers: `Authorization: Bearer <token>`
  - Query params: `page`, `limit`, `search`, `role`, `sortBy`, `sortOrder`
  - Returns: `{ users: User[], pagination: PaginationInfo, filters: FilterInfo }`
- **PATCH** `/admin/users/:id/role` - Update user role (Admin only)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ role: string }`
  - Returns: Updated user object
- **DELETE** `/admin/users/:id` - Delete user (Admin only)
  - Headers: `Authorization: Bearer <token>`
  - Returns: Success confirmation

### Example API Usage

```javascript
// Login flow with automatic token handling
const { data } = await api.post("/auth/login", { email, password });
localStorage.setItem("token", data.token);
// Token automatically included in subsequent requests via Axios interceptor

// Search heroes with pagination
const { data } = await api.get("/heroes", {
  params: { q: "spider", page: 1, limit: 24 }
});

// Add to favorites (requires authentication)
await api.post("/favorites", { heroId: "hero123" });

// Compare teams (requires authentication)
const { data } = await api.post("/teams/compare", {
  teamA: ["hero1", "hero2", "hero3"],
  teamB: ["hero4", "hero5", "hero6"]
});
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
├── components/           # Reusable UI components
│   ├── HeroEditForm.jsx # Comprehensive hero editing modal
│   └── Nav.jsx          # Navigation header with auth state
├── pages/               # Route components
│   ├── AdminUsers.jsx   # Admin user management interface
│   ├── Browse.jsx       # Hero browser with search & pagination
│   ├── Favorites.jsx    # User's favorite heroes display
│   ├── HomeDetail.jsx   # Detailed hero information page
│   ├── Login.jsx        # User login form
│   ├── NotFound.jsx     # 404 error page
│   ├── Register.jsx     # User registration form
│   ├── TeamBuilder.jsx  # Team recommendation interface
│   └── TeamCompare.jsx  # Team comparison interface
├── store/               # Redux state management
│   ├── authSlice.js     # Authentication state and async thunks
│   └── index.js         # Redux store configuration
├── ctx/                 # React Context (legacy, not used)
│   └── AuthContext.jsx  # Context-based auth (replaced by Redux)
├── api.js               # Axios instance with interceptors
├── App.jsx              # Main app component with routing
├── main.jsx             # App entry point with providers
└── index.css            # Global styles and Tailwind imports
```

### Key Files Explained

**Core Application Files:**
- `src/main.jsx` — Application entry point, Redux Provider setup, authentication initialization
- `src/App.jsx` — Main app component with React Router setup and protected routes
- `src/api.js` — Axios instance with automatic token injection and admin API functions

**State Management:**
- `src/store/authSlice.js` — Redux slice for authentication state, login/register/logout thunks
- `src/store/index.js` — Redux store configuration with auth reducer

**Page Components:**
- `src/pages/Browse.jsx` — Hero browser with search, pagination, and responsive grid
- `src/pages/HomeDetail.jsx` — Comprehensive hero detail page with editing capabilities
- `src/pages/TeamBuilder.jsx` — Team recommendation interface with multiple strategies
- `src/pages/TeamCompare.jsx` — Team comparison with dual selection and battle simulation
- `src/pages/AdminUsers.jsx` — Advanced user management with search, filtering, and pagination
- `src/pages/Favorites.jsx` — Personal favorites display and management
- `src/pages/Login.jsx` — Login form with validation and redirect handling
- `src/pages/Register.jsx` — Registration form with comprehensive validation
- `src/pages/NotFound.jsx` — 404 error page with helpful navigation options

**Reusable Components:**
- `src/components/Nav.jsx` — Navigation header with role-based menu items and auth state
- `src/components/HeroEditForm.jsx` — Comprehensive modal form for editing hero details

**Configuration Files:**
- `Dockerfile` — Multi-stage Docker build (Node.js build + Nginx serve)
- `docker-compose.yml` — Docker Compose configuration for container orchestration
- `nginx.conf` — Nginx configuration for serving static files
- `package.json` — Dependencies and scripts configuration
- `tailwind.config.js` — Tailwind CSS configuration
- `postcss.config.js` — PostCSS configuration for Tailwind processing

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
