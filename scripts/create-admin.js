const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

function loadEnv() {
  const envPath = path.resolve(__dirname, "..", ".env");
  try {
    const content = fs.readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  } catch {}
}

loadEnv();

const DB_TYPE = process.env.DB_TYPE || "";
const DATABASE_URL = process.env.DATABASE_URL || "";

function detectDbType() {
  if (DB_TYPE) {
    const t = DB_TYPE.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (["postgresql", "postgres", "supabase", "neon"].includes(t)) return "postgresql";
    if (["sqlite", "sqlite3"].includes(t)) return "sqlite";
  }
  if (DATABASE_URL.startsWith("postgresql://") || DATABASE_URL.startsWith("postgres://")) return "postgresql";
  if (DATABASE_URL.startsWith("sqlite://") || DATABASE_URL.startsWith("file:")) return "sqlite";
  return "postgresql";
}

async function createAdmin(email, password) {
  if (!email || !password) {
    console.error("Usage: node scripts/create-admin.js <email> <password>");
    process.exit(1);
  }

  const dbType = detectDbType();
  const hashedPassword = await bcrypt.hash(password, 10);
  const now = new Date().toISOString();

  try {
    if (dbType === "sqlite") {
      const Database = require("better-sqlite3");
      const dbPath = DATABASE_URL.replace(/^sqlite:\/\//, "").replace(/^file:/, "");
      const sqlite = new Database(dbPath);

      const existing = sqlite.prepare("SELECT id FROM admins WHERE email = ?").get(email);
      if (existing) {
        sqlite.prepare("UPDATE admins SET password = ? WHERE email = ?").run(hashedPassword, email);
        console.log(`✔ Password updated for existing admin: ${email}`);
      } else {
        sqlite.prepare("INSERT INTO admins (email, password, created_at) VALUES (?, ?, ?)").run(email, hashedPassword, now);
        console.log(`✔ Admin created: ${email}`);
      }

      sqlite.close();
    } else {
      const { default: postgres } = await import("postgres");
      const sql = postgres(DATABASE_URL, { prepare: false });

      const [existing] = await sql`SELECT id FROM admins WHERE email = ${email}`;
      if (existing) {
        await sql`UPDATE admins SET password = ${hashedPassword} WHERE email = ${email}`;
        console.log(`✔ Password updated for existing admin: ${email}`);
      } else {
        await sql`INSERT INTO admins (email, password, created_at) VALUES (${email}, ${hashedPassword}, ${now})`;
        console.log(`✔ Admin created: ${email}`);
      }

      await sql.end();
    }
  } catch (err) {
    console.error("✘ Failed to create admin:", err.message);
    process.exit(1);
  }
}

createAdmin(process.argv[2], process.argv[3]);
