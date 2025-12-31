import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createUser() {
  const email = 'admin@example.com';
  const password = 'admin123';
  
  // Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  
  // Create the user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });
  
  console.log('User created:', { email, password });
}

createUser()
  .catch(console.error)
  .finally(() => prisma.$disconnect());import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createUser() {
  const email = 'admin@example.com';
  const password = 'admin123';
  
  // Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  
  // Create the user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });
  
  console.log('User created:', { email, password });
}

createUser()
  .catch(console.error)
  .finally(() => prisma.$disconnect());