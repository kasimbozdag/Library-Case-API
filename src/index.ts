import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables from .env file
dotenv.config();

// Initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // Example: Fetch all users
  const users = await prisma.user.findMany();
  console.log(users);
  const databaseUrl = process.env.DATABASE_URL;
  console.log(databaseUrl);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
