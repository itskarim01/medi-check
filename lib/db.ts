import { Pool } from 'pg'

declare global {
    var pgPool: Pool | undefined;
}

export const pool = global.pgPool ?? new Pool({
    connectionString: process.env.DB_URL,
});

if (process.env.NODE_ENV !== 'production') {
    global.pgPool = pool;
}