import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPass = process.env.ADMIN_PASS;

  if (adminEmail && adminPass) {
    const hashed = await bcrypt.hash(adminPass, 10);
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { password: hashed, role: 'ADMIN' },
      create: { email: adminEmail, password: hashed, role: 'ADMIN', name: 'Administrador' }
    });
    console.log('Admin user ensured:', adminEmail);
  } else {
    console.log('ADMIN_EMAIL or ADMIN_PASS not set - skipping admin seed.');
  }
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });