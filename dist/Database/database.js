import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
class Database {
  connection = null;
  db = null;
  async connect() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined in environment variables");
    }
    this.connection = mysql.createPool({
      uri: process.env.DATABASE_URL,
      waitForConnections: true,
      connectionLimit: parseInt(process.env.DB_POOL_SIZE || "10"),
      maxIdle: parseInt(process.env.DB_POOL_SIZE || "10"),
      idleTimeout: 6e4,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    });
    try {
      const testConn = await this.connection.getConnection();
      testConn.release();
      console.log("\u2705 Database connected successfully");
    } catch (error) {
      console.error("\u274C Database connection failed:", error);
      throw error;
    }
    this.db = drizzle(this.connection);
  }
  async disconnect() {
    if (this.connection) {
      try {
        await this.connection.end();
        console.log("\u2705 Database disconnected successfully");
      } catch (error) {
        console.error("\u274C Error disconnecting database:", error);
      } finally {
        this.connection = null;
        this.db = null;
      }
    }
  }
  async healthCheck() {
    if (!this.connection) {
      return false;
    }
    try {
      const [rows] = await this.connection.execute("SELECT 1 as health_check");
      return true;
    } catch (error) {
      console.error("\u274C Database health check failed:", error);
      return false;
    }
  }
  getDB() {
    if (!this.db) {
      throw new Error("Database not initialized. Call connect() first.");
    }
    return this.db;
  }
}
const database = new Database();
const gracefulShutdown = async (signal) => {
  console.log(`\u274C Closing database connection...`);
  await database.disconnect();
  process.exit(0);
};
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("unhandledRejection", (reason, promise) => {
  console.error("\u274C Unhandled Rejection at:", promise, "reason:", reason);
});
var database_default = database;
export {
  database,
  database_default as default
};
