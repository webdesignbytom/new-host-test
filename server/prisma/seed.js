import dbClient from '../src/utils/dbClient.js';

async function seed() {
  for (let i = 1; i <= 9; i++) {
    const user = await dbClient.user.create({
      data: {
        email: `email${i}@gmail.com`,
      },
    });
  }

  for (let i = 1; i <= 9; i++) {
    const userNote = await dbClient.notification.create({
      data: {
        userId: i,
        type: 'MESSAGE',
        content: 'message aout stuff',
      },
    });

    const devUserNoteSeen = await dbClient.notification.create({
      data: {
        userId: i,
        type: 'MESSAGE',
        content: 'message rest seen',
        viewed: true,
      },
    });
  }
}

seed().catch(async (error) => {
  console.error(error);
  await dbClient.$disconnect();
  process.exit(1);
});
