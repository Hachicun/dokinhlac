const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const prisma = new PrismaClient();

const importUsers = async () => {
    const csvFilePath = ('D:/Dev/dokinhlac/danhsach.csv');
    const csvFile = fs.readFileSync(csvFilePath, 'utf8');

  const { data } = Papa.parse(csvFile, {
    header: true,
    skipEmptyLines: true,
  });

  try {
    for (const user of data) {
      try {
        await prisma.user.create({
          data: {
            user_email: user.user_email,
            user_name: user.user_name,
            user_phone: user.user_phone,
          },
        });
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`User with email ${user.user_email} already exists. Skipping...`);
        } else {
          throw error;
        }
      }
    }
    console.log('Users imported successfully');
  } catch (error) {
    console.error('Error importing users:', error);
  } finally {
    await prisma.$disconnect();
  }
};

importUsers();
