# IRONPULSE — Full-stack gym website

A responsive gym website demo with a React frontend and Express backend. Features:
- Landing page, programs, trainers, pricing and contact section
- Membership enquiry form saved by the API
- Class schedule and class booking API
- Admin-style dashboard endpoints for enquiries/bookings
- Demo authentication with hashed passwords and JWT
- JSON-file persistence (easy local setup; no database server required)

> This is a project/demo starter, not a production-ready membership or payment system. Do not collect real payment details. Before public production use, add rate limiting, stronger validation, HTTPS, managed database/backups, email verification, password reset and a proper admin authorization flow.

## Requirements
- Node.js 20+ (18+ may work)
- npm

## Run locally
Open a terminal in the `ironpulse-gym` folder:

```bash
npm install
npm install --prefix server
npm install --prefix client
cp server/.env.example server/.env
npm run dev
```

Open http://localhost:5173. API health check: http://localhost:5000/api/health

Windows PowerShell alternative to the `cp` command:
```powershell
Copy-Item server/.env.example server/.env
```

### Demo API
- `GET /api/health`
- `GET /api/classes`
- `POST /api/enquiries` with `{ "name": "...", "email": "...", "goal": "...", "plan": "..." }`
- `POST /api/bookings` with `{ "name": "...", "email": "...", "classId": "..." }`
- `POST /api/auth/register` with `{ "name": "...", "email": "...", "password": "..." }`
- `POST /api/auth/login` with `{ "email": "...", "password": "..." }`
- `GET /api/dashboard` (requires `Authorization: Bearer <token>`; demo user token works)

The client is configured to call `/api`; Vite proxies it to localhost:5000 during development.

## Production build
```bash
npm run build
npm start
```
The Express server serves the built frontend from `client/dist` when that folder exists.

## Deploy (simple single-service option)
1. Push this folder to a GitHub repository.
2. Create a Node web service on Render (or a similar Node host).
3. Build command: `npm install && npm install --prefix server && npm install --prefix client && npm run build`
4. Start command: `npm start`
5. Set environment variables:
   - `PORT` = host-provided port (usually set automatically)
   - `JWT_SECRET` = a long random secret (at least 32 random characters)
   - `NODE_ENV` = `production`
6. Important: JSON-file persistence is suitable for demos, but many hosts use ephemeral filesystems. For durable public deployment, replace `server/src/store.js` with a managed database (Postgres is a good option) or attach persistent storage.

## Presentation walkthrough (2–3 minutes)
1. Introduce IRONPULSE as a mobile-friendly gym discovery and membership website.
2. Show the hero section and responsive navigation.
3. Scroll through programs, trainers and membership plans.
4. Submit the membership form and show the success message.
5. Explain the backend: Express REST API, validation, hashed passwords, JWT, and persistent JSON store.
6. Show API health and class endpoints in a browser or terminal.
7. Explain future scope: admin panel, payment gateway, attendance tracking, email reminders and PostgreSQL.

## Useful terminal commands
```bash
npm run dev       # frontend + backend in development
npm run build     # create production frontend bundle
npm start         # run Express server (serves frontend build if built)
```
