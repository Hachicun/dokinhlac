const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const newUser = await prisma.user.create({
    data: {
      user_email: 'admin@luckhi.vn',
      user_name: 'VuDucDai',
      user_phone: '0397609660'
    }
  });
  console.log('User created:', newUser);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
