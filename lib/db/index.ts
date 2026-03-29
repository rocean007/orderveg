import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create connection with security settings
const connectionString = process.env.DATABASE_URL;

// Configure postgres client with security and performance settings
const client = postgres(connectionString, {
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : false,
  max: 10, // Connection pool size
  idle_timeout: 20,
  connect_timeout: 10,
  prepare: false, // Disable prepared statements for serverless
});

// Create Drizzle instance
export const db = drizzle(client, { schema });

// Export types
export type Vegetable = typeof schema.vegetables.$inferSelect;
export type NewVegetable = typeof schema.vegetables.$inferInsert;
export type User = typeof schema.users.$inferSelect;
export type NewUser = typeof schema.users.$inferInsert;
export type Order = typeof schema.orders.$inferSelect;
export type NewOrder = typeof schema.orders.$inferInsert;
export type CartItem = typeof schema.cartItems.$inferSelect;
export type NewCartItem = typeof schema.cartItems.$inferInsert;
