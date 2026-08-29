import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function test() {
  try {
    console.log("Connecting to database...");
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log("✓ Connection successful!");
    console.log(result);
  } catch (e) {
    console.error("✗ Connection failed:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
