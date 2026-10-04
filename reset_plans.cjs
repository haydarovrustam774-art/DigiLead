const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.digitalActionPlan.deleteMany().then(() => console.log('Deleted old plans')).catch(console.error).finally(() => prisma.$disconnect());
