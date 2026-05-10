# Career Discovery Library 📚

A full-stack web application that helps users explore career paths, track skill progress, and bookmark careers of interest. Built with React + Vite on the frontend and Node.js/Express + MongoDB on the backend, and deployed on Render.

---

## 🌟 Features

- **Authentication** — JWT-based register, login, and logout with bcrypt password hashing
- **Career Explorer** — Browse, search, and filter careers by keyword, category, and demand level
- **Career Management** — Full CRUD for careers (title, category, description, salary, demand level, skills, image)
- **Skills Library** — Browse and manage a library of skills with full CRUD support
- **Categories** — Organize careers into categories with live career counts
- **Bookmarks** — Save and unsave careers per user account
- **Progress Tracking** — Track learning progress per skill (0–100%)
- **Dashboard** — View popular careers, top in-demand skills, and continue your learning journey
- **Security** — Helmet headers, rate limiting on auth routes, Zod validation, centralized error handling
- **Responsive UI** — Purple gradient hero, sidebar navigation, and card-based layout built with Tailwind CSS

---

## 🛠 Tech Stack

| Layer    | Technology                                                                      |
| -------- | ------------------------------------------------------------------------------- |
| Frontend | React 18, Vite, React Router v6, Tailwind CSS, Axios, SweetAlert2, Lucide React |
| Backend  | Node.js, Express 4, Mongoose, JWT, bcryptjs, Zod, Helmet, Morgan                |
| Database | MongoDB                                                                         |
| Hosting  | Render (backend as Web Service, frontend as Static Site)                        |

---

## 📁 Folder Structure

```
career-discovery-library/
├── client/                     # React (Vite) frontend
│   ├── public/
│   ├── src/
│   │   ├── api/                # Axios API helpers
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # React context (auth, global state)
│   │   ├── hooks/              # Custom hooks
│   │   ├── pages/              # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Careers.jsx
│   │   │   ├── CareerDetail.jsx
│   │   │   ├── CareerForm.jsx
│   │   │   ├── Categories.jsx
│   │   │   ├── Skills.jsx
│   │   │   ├── Search.jsx
│   │   │   ├── Saved.jsx
│   │   │   ├── Progress.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── server/                     # Express API (MVC)
    └── src/
        ├── config/             # DB connection
        ├── controllers/        # Route handlers
        ├── middleware/         # Auth, error handling, encrypt/decrypt
        ├── models/             # Mongoose schemas
        ├── routes/             # Express routers
        ├── seed/               # Database seed script
        ├── validators/         # Zod schemas
        └── index.js            # App entry point
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites

- Node.js 18+
- MongoDB running locally at `mongodb://127.0.0.1:27017`, or a MongoDB Atlas URI

### 1. Clone the repository

```bash
git clone https://github.com/your-username/career-discovery-library.git
cd career-discovery-library
```

### 2. Set up the server

```bash
cd server
npm install
```

Create a `.env` file inside `/server`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/career-discovery-library
JWT_SECRET=your_jwt_secret_here
CORS_ORIGIN=http://localhost:5173
```

Seed the database with sample data:

```bash
npm run seed
```

Start the dev server:

```bash
npm run dev
```

### 3. Set up the client

```bash
cd ../client
npm install
```

Create a `.env` file inside `/client`:

```env
VITE_API_URL=http://localhost:5000
```

Start the client dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## ☁️ Deployment on Render

This project is deployed on [Render](https://render.com).

### Backend — Web Service

| Setting        | Value         |
| -------------- | ------------- |
| Root Directory | `server`      |
| Build Command  | `npm install` |
| Start Command  | `npm start`   |
| Environment    | Node          |

Set the following environment variables in the Render dashboard:

```
MONGO_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<a strong random secret>
CORS_ORIGIN=<your Render frontend URL, e.g. https://career-discovery-library.onrender.com>
PORT=5000
```

### Frontend — Static Site

| Setting           | Value                          |
| ----------------- | ------------------------------ |
| Root Directory    | `client`                       |
| Build Command     | `npm install && npm run build` |
| Publish Directory | `dist`                         |

Set the following environment variable:

```
VITE_API_URL=<your Render backend URL, e.g. https://career-discovery-library-api.onrender.com>
```

> **Note:** Render free-tier services spin down after inactivity. The first request after a cold start may take 30–60 seconds.

---

## 🔌 API Reference

All API routes are prefixed with `/api`. Protected routes require a `Authorization: Bearer <token>` header.

| Method | Endpoint                 | Auth | Description                                         |
| ------ | ------------------------ | ---- | --------------------------------------------------- |
| GET    | `/api/health`            | —    | Health check                                        |
| POST   | `/api/auth/register`     | —    | Create a new account                                |
| POST   | `/api/auth/login`        | —    | Login and receive a JWT                             |
| GET    | `/api/auth/me`           | ✅   | Get the current authenticated user                  |
| GET    | `/api/categories`        | —    | List all categories with career counts              |
| POST   | `/api/categories`        | ✅   | Create a category                                   |
| GET    | `/api/skills`            | —    | List all skills (filter with `?q=`)                 |
| POST   | `/api/skills`            | ✅   | Create a skill                                      |
| GET    | `/api/careers`           | —    | List careers (`?q=&category=&demand=&page=&limit=`) |
| GET    | `/api/careers/:id`       | —    | Get career detail                                   |
| POST   | `/api/careers`           | ✅   | Create a career                                     |
| PUT    | `/api/careers/:id`       | ✅   | Update a career                                     |
| DELETE | `/api/careers/:id`       | ✅   | Delete a career                                     |
| GET    | `/api/saved`             | ✅   | Get my saved careers                                |
| POST   | `/api/saved/:careerId`   | ✅   | Save a career                                       |
| DELETE | `/api/saved/:careerId`   | ✅   | Unsave a career                                     |
| GET    | `/api/progress`          | ✅   | Get my skill progress                               |
| PUT    | `/api/progress/:skillId` | ✅   | Upsert skill progress (0–100)                       |
| GET    | `/api/dashboard`         | ✅   | Get aggregated dashboard data                       |
| GET    | `/api/search`            | —    | Search across careers and skills                    |

---

## 🌱 Seed Data

To populate the database with sample categories, skills, and careers:

```bash
cd server
npm run seed
```

A demo user is created with the following credentials:

- **Email:** `ava@example.com`
- **Password:** `password123`

---

## 📄 License

MIT
