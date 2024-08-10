import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables from .env file
dotenv.config();

// Initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // Fetch all users
  const users = await prisma.user.findMany();
  console.log(users);

  // Fetch all books
  const books = await prisma.book.findMany();
  console.log(books);

  // Fetch all borrow records
  const borrows = await prisma.borrow.findMany({
    include: {
      user: true,
      book: true,
    },
  });
  console.log(borrows);
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
