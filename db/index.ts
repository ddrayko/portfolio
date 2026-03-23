import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const databaseUrl = process.env.DATABASE_URL;

let _db: any = null;

const createDbInstance = () => {
    if (_db) return _db;
    
    if (!databaseUrl) {
        throw new Error("DATABASE_URL is not set. Please check your environment variables.");
    }
    
    const sql = neon(databaseUrl);
    _db = drizzle(sql, { schema });
    return _db;
};

// Use a Proxy to defer initialization until a method is accessed
export const db = new Proxy({} as any, {
    get(target, prop, receiver) {
        // We initialize on any property access
        const instance = createDbInstance();
        return Reflect.get(instance, prop, receiver);
    }
});
