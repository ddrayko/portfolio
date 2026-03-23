const { neon } = require("@neondatabase/serverless");
const { drizzle } = require("drizzle-orm/neon-serverless");
const dotenv = require("dotenv");

dotenv.config();

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function listAdmins() {
  try {
    const result = await sql`SELECT id, email, password FROM admins`;
    console.log("--- CURRENT ADMINS ---");
    console.log(JSON.stringify(result, null, 2));
    console.log("----------------------");
  } catch (err) {
    console.error("Error:", err);
  }
}

listAdmins();
