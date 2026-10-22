import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(here, "../data");
const dataFile = path.join(dataDir, "db.json");

const initial = {
  users: [],
  enquiries: [],
  bookings: [],
  classes: [
    { id: "strength", name: "Strength Lab", coach: "Marcus Reed", time: "Mon / Wed / Fri · 7:00 AM", level: "All levels", spots: 8, category: "STRENGTH" },
    { id: "hiit", name: "HIIT & Burn", coach: "Ava Mitchell", time: "Tue / Thu · 6:30 PM", level: "Intermediate", spots: 6, category: "CONDITIONING" },
    { id: "flow", name: "Mobility Flow", coach: "Nina Patel", time: "Saturday · 9:00 AM", level: "All levels", spots: 10, category: "RECOVERY" }
  ]
};

export function readStore() {
  fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify(initial, null, 2));
  try { return JSON.parse(fs.readFileSync(dataFile, "utf8")); }
  catch { return structuredClone(initial); }
}
export function writeStore(data) {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}
