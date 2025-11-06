import type { Config } from 'drizzle-kit';

export default {
    schema: './src/Database/schema.ts',
    out: './src/Database/drizzle',
    dialect: 'mysql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
    verbose: true,
    strict: true,
} satisfies Config;