import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readStore, writeStore } from "./store.js";

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "local-development-secret-change-me";
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(",") || true }));
app.use(express.json({ limit: "30kb" }));

const clean = (v, max = 120) => typeof v === "string" ? v.trim().slice(0, max) : "";
const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const fail = (res, status, message) => res.status(status).json({ error: message });

function auth(req, res, next) {
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!token) return fail(res, 401, "Sign in to access this resource.");
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { return fail(res, 401, "Session expired. Please sign in again."); }
}

app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "IRONPULSE API", timestamp: new Date().toISOString() }));
app.get("/api/classes", (_req, res) => res.json(readStore().classes));

app.post("/api/enquiries", (req, res) => {
  const name = clean(req.body.name, 80), email = clean(req.body.email, 140).toLowerCase();
  const goal = clean(req.body.goal, 250), plan = clean(req.body.plan, 40);
  if (name.length < 2 || !validEmail(email)) return fail(res, 400, "Please provide a name and valid email.");
  const db = readStore();
  const item = { id: crypto.randomUUID(), name, email, goal, plan, createdAt: new Date().toISOString() };
  db.enquiries.unshift(item); writeStore(db);
  res.status(201).json({ message: "Thanks! Our team will be in touch soon.", enquiry: { id: item.id } });
});

app.post("/api/bookings", (req, res) => {
  const name = clean(req.body.name, 80), email = clean(req.body.email, 140).toLowerCase();
  const classId = clean(req.body.classId, 50);
  if (name.length < 2 || !validEmail(email)) return fail(res, 400, "Please provide a name and valid email.");
  const db = readStore(), cls = db.classes.find(c => c.id === classId);
  if (!cls) return fail(res, 404, "Class not found.");
  const already = db.bookings.some(b => b.classId === classId && b.email === email);
  if (already) return fail(res, 409, "This email already has a booking for that class.");
  const item = { id: crypto.randomUUID(), name, email, classId, className: cls.name, createdAt: new Date().toISOString() };
  db.bookings.unshift(item); writeStore(db);
  res.status(201).json({ message: `You're on the list for ${cls.name}!`, booking: { id: item.id } });
});

app.post("/api/auth/register", async (req, res) => {
  const name = clean(req.body.name, 80), email = clean(req.body.email, 140).toLowerCase();
  const password = typeof req.body.password === "string" ? req.body.password : "";
  if (name.length < 2 || !validEmail(email) || password.length < 8) return fail(res, 400, "Use a name, valid email and password of at least 8 characters.");
  const db = readStore();
  if (db.users.some(u => u.email === email)) return fail(res, 409, "An account with this email already exists.");
  const user = { id: crypto.randomUUID(), name, email, passwordHash: await bcrypt.hash(password, 12), createdAt: new Date().toISOString() };
  db.users.push(user); writeStore(db);
  const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: "2h" });
  res.status(201).json({ token, user: { id: user.id, name, email } });
});

app.post("/api/auth/login", async (req, res) => {
  const email = clean(req.body.email, 140).toLowerCase(), password = typeof req.body.password === "string" ? req.body.password : "";
  const db = readStore(), user = db.users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return fail(res, 401, "Email or password is incorrect.");
  const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: "2h" });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

app.get("/api/dashboard", auth, (req, res) => {
  const db = readStore();
  res.json({
    user: req.user,
    stats: { members: db.users.length, enquiries: db.enquiries.length, bookings: db.bookings.length },
    enquiries: db.enquiries.slice(0, 20).map(({ id, name, email, goal, plan, createdAt }) => ({ id, name, email, goal, plan, createdAt })),
    bookings: db.bookings.slice(0, 20)
  });
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.resolve(__dirname, "../../client/dist");
app.use(express.static(clientDist));
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) return fail(res, 404, "API route not found.");
  res.sendFile(path.join(clientDist, "index.html"), err => { if (err) next(); });
});
app.listen(PORT, () => console.log(`IRONPULSE API running at http://localhost:${PORT}`));
