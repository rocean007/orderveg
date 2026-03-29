import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',      // replaces 'driver: "pg"'
  dbCredentials: {
    url: process.env.DATABASE_URL!,  // replaces 'connectionString'
  },
  verbose: true,
  strict: true,
});