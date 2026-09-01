import { prisma } from "./prisma";

// Small database helpers used across repositories.

/** Returns true when the local SQLite database has been pushed and is reachable. */
export async function checkDatabase(): Promise<{
  healthy: boolean;
  error?: string;
}> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { healthy: true };
  } catch (err) {
    return {
      healthy: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Runs `fn` inside a transaction. SQLite supports interactive transactions;
 * on PostgreSQL this becomes a real DB transaction (production).
 */
export async function withTransaction<T>(fn: () => Promise<T>): Promise<T> {
  return prisma.$transaction(fn);
}