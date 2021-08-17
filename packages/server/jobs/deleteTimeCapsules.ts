import { PrismaClient } from '@prisma/client'
import { parentPort } from "worker_threads";

const prisma = new PrismaClient();

(function checkTimeCapsulesToDelete() {
  prisma?.timeCapsule?.findMany({
    where: {
      AND: {
        emailConfirmed: false,
        emailSent: false,
      },
      OR: {
        scheduledTo: {
          lt: new Date(),
        }
      }
    }
  }).then(async timeCapsulesToDelete => {
    try {
      await prisma.timeCapsule.deleteMany({ where: { id: { in: timeCapsulesToDelete?.map(timeCapsuleToDelete => timeCapsuleToDelete?.id) } } })
    } catch (err) {
      console.error('Error deleting time capsules', err)
    } finally {
      if (parentPort) {
        parentPort.postMessage('done');
      } else {
        process.exit(0);
      }
    }
  })
})()


