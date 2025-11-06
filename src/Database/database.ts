import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

class Database {
    private connection: mysql.Pool | null = null;
    public db: any = null;

    public async connect() {
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL is not defined in environment variables');
        }

        this.connection = mysql.createPool({
            uri: process.env.DATABASE_URL,
            waitForConnections: true,
            connectionLimit: parseInt(process.env.DB_POOL_SIZE || '10'),
            maxIdle: parseInt(process.env.DB_POOL_SIZE || '10'),
            idleTimeout: 60000,
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0,
        });

        // Test connection
        try {
            const testConn = await this.connection.getConnection();
            testConn.release();
            console.log('✅ Database connected successfully');
        } catch (error) {
            console.error('❌ Database connection failed:', error);
            throw error;
        }

        // Initialize Drizzle
        this.db = drizzle(this.connection);
    }

    public async disconnect() {
        if (this.connection) {
            try {
                await this.connection.end();
                console.log('✅ Database disconnected successfully');
            } catch (error) {
                console.error('❌ Error disconnecting database:', error);
            } finally {
                this.connection = null;
                this.db = null;
            }
        }
    }

    public async healthCheck(): Promise<boolean> {
        if (!this.connection) {
            return false;
        }

        try {
            const [rows] = await this.connection.execute('SELECT 1 as health_check');
            return true;
        } catch (error) {
            console.error('❌ Database health check failed:', error);
            return false;
        }
    }

    public getDB() {
        if (!this.db) {
            throw new Error('Database not initialized. Call connect() first.');
        }
        return this.db;
    }
}

export const database = new Database();

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
    console.log(`❌ Closing database connection...`);
    await database.disconnect();
    process.exit(0);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Обработка необработанных обещаний
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

export default database;