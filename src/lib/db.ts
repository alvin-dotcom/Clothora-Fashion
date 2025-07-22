// src/lib/db.ts
import { Pool } from 'pg';

let pool: Pool;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

try {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Required for Neon, but consider security implications
    },
  });

  pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
  });
  
  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    // process.exit(-1); // Optional: exit if a critical error occurs
  });

} catch (error) {
  console.error("Failed to initialize PostgreSQL pool:", error);
  throw error; // Re-throw to prevent application from starting in a bad state
}


export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Error executing query', { text, error });
    throw error;
  }
};

export default pool;
