# Career Discovery Library (MERN)

A full-stack Career Discovery platform built with **MongoDB, Express, React, Node.js**.
Replaces the SQL spec from the assignment with a MongoDB/Mongoose data model.

## Features

- JWT auth (register / login / logout, bcrypt password hashing)
- Career CRUD (title, category, description, salary, demand level, skills, image)
- Skill CRUD + Skills Library
- Category CRUD with career counts
- Search & filter careers (by text, category, demand)
- Save / unsave (bookmark) careers per user
- Track learning progress per skill (0-100%)
- Dashboard: popular careers, top skills in demand, continue your journey
- Responsive UI matching the reference design (purple gradient hero, sidebar, cards)
- Validation (Zod), centralized error handling, helmet, rate limiting
- Pagination & filters
- Seed script with sample categories, skills, careers

## Folder Structure

```
/server   Express API (MVC)
  /models /routes /controllers /middleware /validators /config /seed
/client   React (Vite) + Tailwind + React Router
  /src/pages /components /context /api /hooks
```

## Prerequisites

- Node.js 18+
- MongoDB running locally on `mongodb://127.0.0.1:27017` (or set `MONGO_URI`)

## Run Locally

### 1. Backend

```bash
cd server
cp .env.example .env        # edit MONGO_URI / JWT_SECRET if needed
npm install
npm run seed                # populates categories, skills, sample careers
npm run dev                 # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev                 # starts on http://localhost:5173
```

Open <http://localhost:5173>. Register a new account or use the seeded test user:

- **Email:** `ava@example.com`
- **Password:** `password123`

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/auth/register      | Create account |
| POST   | /api/auth/login         | Login, returns JWT |
| GET    | /api/auth/me            | Current user (auth) |
| GET    | /api/categories         | List categories with career counts |
| POST   | /api/categories         | Create (auth) |
| GET    | /api/skills             | List skills (filter: ?q=) |
| POST   | /api/skills             | Create (auth) |
| GET    | /api/careers            | List (?q=&category=&demand=&page=&limit=) |
| GET    | /api/careers/:id        | Detail |
| POST   | /api/careers            | Create (auth) |
| PUT    | /api/careers/:id        | Update (auth) |
| DELETE | /api/careers/:id        | Delete (auth) |
| POST   | /api/saved/:careerId    | Save career (auth) |
| DELETE | /api/saved/:careerId    | Unsave (auth) |
| GET    | /api/saved              | My saved careers (auth) |
| GET    | /api/progress           | My progress (auth) |
| PUT    | /api/progress/:skillId  | Upsert progress (auth) |
| GET    | /api/dashboard          | Aggregated dashboard data (auth) |

## Deployment

- Frontend: Vercel / Netlify / S3 + CloudFront
- Backend: Render / Railway / Elastic Beanstalk / EC2
- Database: MongoDB Atlas (free tier) — set `MONGO_URI` in backend env

## License

MIT
