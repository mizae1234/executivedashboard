
import { Pool } from 'pg';

// Use a global variable to prevent multiple connections in development
let pool: Pool;

if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  });
} else {
  if (!(global as any).dbPool) {
    (global as any).dbPool = new Pool({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME,
    });
  }
  pool = (global as any).dbPool;
}

export default pool;
