export default async function getPrisma() {
  if (process.env.USE_DB === 'true') {
    const { PrismaClient } = await import('@prisma/client');
    return new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    });
  } else {
    return null; // No database, use local data
  }
}
