import { PrismaClient } from '@prisma/client'
import {sendEmailWithTemplate} from "../src/services/mailjet";
import { parentPort } from "worker_threads";
import {isToday, parseISO} from "date-fns";

const prisma = new PrismaClient();

const TIME_CAPSULE_EMAIL = 3106993;

(function checkEmailsToBeSent() {
  prisma?.timeCapsule?.findMany({
    where: {
      AND: {
        emailConfirmed: true,
        emailSent: false,
      }
    }
  }).then(async confirmedTimeCapsules => {
    const timeCapsulesToSend = confirmedTimeCapsules
      ?.filter(confirmedTimeCapsule => {
        return isToday(confirmedTimeCapsule?.scheduledTo)
      })

    const emailsPromises = timeCapsulesToSend
      ?.map(confirmedTimeCapsule => {
      return sendEmailWithTemplate(
        TIME_CAPSULE_EMAIL,
        [{ Email: confirmedTimeCapsule?.email, Name: confirmedTimeCapsule?.email }],
        'DTime Vault - Here is one of your time capsules',
        { content: confirmedTimeCapsule?.content })
    })

    try {
      await Promise.all(emailsPromises)
      await prisma?.timeCapsule?.updateMany({
        where: {
          id: {
            in: timeCapsulesToSend?.map(timeCapsulesToSend => timeCapsulesToSend?.id),
          }
        },
        data: {
          emailSent: true,
        }
      })
    } catch (err) {
      console.error('Error sending emails containing time capsules', err)
    } finally {
      if (parentPort) {
        parentPort.postMessage('done');
      } else {
        process.exit(0);
      }
    }
  })
})()


