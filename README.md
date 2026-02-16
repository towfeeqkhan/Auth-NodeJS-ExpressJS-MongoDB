# 🔐 MERN JWT Authentication

A full-stack authentication system built with the **MERN stack** (MongoDB, Express.js, React, Node.js) featuring **JWT (JSON Web Token)** based authentication with **access/refresh token rotation** and **Google OAuth 2.0** login.

---

## ✨ Features

- 📝 **User Registration** — Sign up with name, email, and password
- 🔑 **User Login** — Authenticate with email and password
- 🔄 **JWT Access & Refresh Tokens** — Short-lived access tokens (15m) + long-lived refresh tokens (7d) stored in HTTP-only cookies
- 🔁 **Silent Token Refresh** — Automatic access token renewal via Axios interceptors when a 401 is received
- 🌐 **Google OAuth 2.0** — One-click sign-in/sign-up with Google using Passport.js
- 🛡️ **Protected Routes** — Frontend route guards and backend middleware for authenticated endpoints
- 🚪 **Redirect If Authenticated** — Logged-in users are redirected away from login/register pages
- ✅ **Input Validation** — Server-side validation with Zod schemas
- 🔒 **Password Hashing** — Bcrypt with salt rounds of 12
- 🎨 **Modern UI** — Clean, responsive design with Tailwind CSS v4

---

## 🛠️ Tech Stack

### Frontend

| Technology       | Version  | Purpose                        |
| ---------------- | -------- | ------------------------------ |
| React            | ^19.2.0  | UI library                     |
| React Router     | ^7.13.0  | Client-side routing            |
| Axios            | ^1.13.5  | HTTP client                    |
| Tailwind CSS     | ^4.1.18  | Utility-first CSS framework    |
| Vite             | ^7.3.1   | Build tool & dev server        |
| ESLint           | ^9.39.1  | Code linting                   |

### Backend

| Technology              | Version  | Purpose                           |
| ----------------------- | -------- | --------------------------------- |
| Node.js                 | —        | JavaScript runtime                |
| Express                 | ^5.2.1   | Web framework                     |
| MongoDB / Mongoose      | ^9.1.6   | Database & ODM                    |
| JSON Web Token (JWT)    | ^9.0.3   | Token-based authentication        |
| Bcrypt                  | ^6.0.0   | Password hashing                  |
| Passport.js             | ^0.7.0   | Authentication middleware          |
| Passport Google OAuth2  | ^0.2.0   | Google OAuth 2.0 strategy         |
| Zod                     | ^4.3.6   | Input validation                  |
| Cookie Parser           | ^1.4.7   | Cookie parsing middleware         |
| CORS                    | ^2.8.6   | Cross-Origin Resource Sharing     |
| ms                      | ^2.1.3   | Time string conversion            |

---

## 📁 Project Structure

```
Auth-ReactJS-NodeJS-ExpressJS-MongoDB/
├── backend/
│   ├── config/
│   │   ├── db.js                  # MongoDB connection setup
│   │   └── passport.js            # Google OAuth Passport strategy
│   ├── controllers/
│   │   └── auth.controller.js     # Register, Login, Verify, Refresh, Logout handlers
│   ├── middlewares/
│   │   └── auth.middleware.js     # JWT access token verification middleware
│   ├── models/
│   │   └── user.model.js          # Mongoose User schema
│   ├── routes/
│   │   ├── auth.route.js          # Auth routes (register, login, verify, refresh, logout)
│   │   └── googleAuth.route.js    # Google OAuth routes
│   ├── utils/
│   │   ├── generateToken.js       # JWT access & refresh token generation
│   │   └── zodError.helper.js     # Zod error formatting utility
│   ├── validators/
│   │   └── user.validator.js      # Zod schemas for signup & login validation
│   ├── .env.example               # Backend environment variable template
│   ├── index.js                   # Express app entry point
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js           # Axios instance with interceptors & token management
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx        # Auth guard for protected pages
│   │   │   └── RedirectIfAuthenticated.jsx # Redirects logged-in users from auth pages
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # React context for auth state management
│   │   ├── layout/
│   │   │   └── MainLayout.jsx     # App layout wrapper
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx      # Protected dashboard page
│   │   │   ├── GoogleAuthSuccess.jsx # Google OAuth callback handler page
│   │   │   ├── Homepage.jsx       # Landing page
│   │   │   ├── Login.jsx          # Login page
│   │   │   └── Register.jsx       # Registration page
│   │   ├── index.css              # Global styles (Tailwind imports)
│   │   └── main.jsx               # App entry point with router configuration
│   ├── .env.example               # Frontend environment variable template
│   ├── index.html                 # HTML entry point
│   ├── vite.config.js             # Vite configuration
│   ├── eslint.config.js           # ESLint configuration
│   └── package.json
│
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or later recommended)
- **MongoDB** (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Google Cloud Console** project with OAuth 2.0 credentials (for Google login)

### 1. Clone the Repository

```bash
git clone https://github.com/towfeeqkhan/Auth-ReactJS-NodeJS-ExpressJS-MongoDB.git
cd Auth-ReactJS-NodeJS-ExpressJS-MongoDB
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file by copying the example:

```bash
cp .env.example .env
```

Fill in your environment variables:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/auth_db
JWT_ACCESS_KEY=your_access_token_secret
JWT_ACCESS_KEY_EXPIRES_IN=15m
JWT_REFRESH_KEY=your_refresh_token_secret
JWT_REFRESH_KEY_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run server
```

> The backend runs on `http://localhost:3000` by default.

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file by copying the example:

```bash
cp .env.example .env
```

Fill in your environment variable:

```env
VITE_BACKEND_URL=http://localhost:3000
```

Start the frontend dev server:

```bash
npm run dev
```

> The frontend runs on `http://localhost:5173` by default.

---

## 🔗 API Endpoints

### Authentication Routes — `/api/auth`

| Method | Endpoint             | Description                       | Auth Required |
| ------ | -------------------- | --------------------------------- | ------------- |
| POST   | `/api/auth/register` | Register a new user               | ❌            |
| POST   | `/api/auth/login`    | Login with email & password       | ❌            |
| GET    | `/api/auth/verify`   | Verify current user (via token)   | ✅            |
| POST   | `/api/auth/refresh`  | Refresh access token via cookie   | ❌ (cookie)   |
| POST   | `/api/auth/logout`   | Logout & clear refresh token      | ❌            |

### Google OAuth Routes — `/api/auth`

| Method | Endpoint                    | Description                              |
| ------ | --------------------------- | ---------------------------------------- |
| GET    | `/api/auth/google`          | Initiate Google OAuth flow               |
| GET    | `/api/auth/google/callback` | Google OAuth callback (handled by Passport) |

---

## 🔐 Authentication Flow

### Email/Password Authentication

```
┌─────────┐         ┌─────────┐         ┌─────────┐
│  Client  │         │  Server  │         │  MongoDB │
└────┬─────┘         └────┬─────┘         └────┬─────┘
     │  POST /register    │                     │
     │───────────────────>│  Hash password       │
     │                    │  (bcrypt, 12 rounds) │
     │                    │────────────────────>│ Save user
     │                    │<────────────────────│
     │  accessToken +     │                     │
     │  refreshToken      │                     │
     │<───────────────────│                     │
     │  (cookie)          │                     │
     │                    │                     │
     │  POST /login       │                     │
     │───────────────────>│  Verify password     │
     │                    │────────────────────>│ Find user
     │                    │<────────────────────│
     │  accessToken +     │  Hash & save new    │
     │  refreshToken      │  refreshToken       │
     │<───────────────────│────────────────────>│
     │                    │                     │
```

### Token Refresh (Silent)

```
┌─────────┐         ┌─────────┐
│  Client  │         │  Server  │
└────┬─────┘         └────┬─────┘
     │  API call (401)    │
     │───────────────────>│
     │<───────────────────│  401 Unauthorized
     │                    │
     │  POST /refresh     │
     │  (refreshToken     │
     │   cookie)          │
     │───────────────────>│  Verify refresh token
     │                    │  Generate new token pair
     │  New accessToken + │  Hash & save new refresh
     │  refreshToken      │
     │<───────────────────│
     │                    │
     │  Retry original    │
     │  request           │
     │───────────────────>│
     │<───────────────────│  ✅ Success
```

### Google OAuth Flow

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  Client  │    │  Server  │    │  Google  │    │  MongoDB │
└────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘
     │  Click       │               │               │
     │  "Google"    │               │               │
     │─────────────>│  Redirect     │               │
     │              │──────────────>│               │
     │              │               │  User         │
     │              │               │  consents     │
     │              │  Callback     │               │
     │              │<──────────────│               │
     │              │  Find/Create  │               │
     │              │  user         │               │
     │              │──────────────────────────────>│
     │              │<──────────────────────────────│
     │  Redirect to │               │               │
     │  /auth/      │               │               │
     │  success?    │               │               │
     │  accessToken │               │               │
     │<─────────────│               │               │
```

---

## 📋 User Model

| Field          | Type     | Details                                     |
| -------------- | -------- | ------------------------------------------- |
| `name`         | String   | Required, min 3 characters                  |
| `email`        | String   | Required, unique, lowercase                 |
| `password`     | String   | Optional (not required for Google OAuth)    |
| `googleId`     | String   | Unique, sparse index (for Google users)     |
| `avatar`       | String   | Default Gravatar placeholder                |
| `role`         | String   | `"user"` or `"admin"`, default `"user"`     |
| `refreshToken` | String   | Hashed refresh token                        |
| `createdAt`    | Date     | Auto-generated (timestamps)                 |
| `updatedAt`    | Date     | Auto-generated (timestamps)                 |

---

## 🛡️ Security Features

- **Access Tokens** — Short-lived (15 min default), stored in memory (not localStorage)
- **Refresh Tokens** — Long-lived (7 days default), stored in HTTP-only, secure, SameSite=strict cookies
- **Refresh Token Hashing** — Refresh tokens are bcrypt-hashed before being stored in the database
- **Token Rotation** — A new refresh token is issued on every refresh, invalidating the old one
- **Password Hashing** — Bcrypt with 12 salt rounds
- **CORS** — Configured to only allow requests from the specified frontend URL
- **Input Validation** — All inputs validated with Zod schemas before processing
- **Auto-Refresh Interceptor** — Axios response interceptor with request queuing to handle concurrent 401s gracefully

---

## 🌐 Frontend Routes

| Path              | Component              | Access           |
| ----------------- | ---------------------- | ---------------- |
| `/`               | Homepage               | Public           |
| `/login`          | Login                  | Public (redirects if authenticated) |
| `/register`       | Register               | Public (redirects if authenticated) |
| `/dashboard`      | Dashboard              | Protected        |
| `/auth/success`   | GoogleAuthSuccess      | Public (callback handler) |

---

## ⚙️ Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Navigate to **APIs & Services** → **Credentials**
4. Create an **OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Authorized redirect URIs: `http://localhost:3000/api/auth/google/callback`
5. Copy the **Client ID** and **Client Secret** to your backend `.env` file

---

## 📜 Available Scripts

### Backend (`/backend`)

| Command           | Description                               |
| ----------------- | ----------------------------------------- |
| `npm run server`  | Start the server with nodemon (hot reload)|

### Frontend (`/frontend`)

| Command           | Description                               |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Start Vite dev server with HMR            |
| `npm run build`   | Build for production                      |
| `npm run preview` | Preview production build locally          |
| `npm run lint`    | Run ESLint                                |

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 🙋‍♂️ Author

**Towfeeq Khan** — [@towfeeqkhan](https://github.com/towfeeqkhan)
