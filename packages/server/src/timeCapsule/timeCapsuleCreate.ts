import {KoaContext} from "../globalInterfaces";
import * as yup from 'yup'
import Chance from 'chance'
import {isAfter, parseISO} from "date-fns";
import {sendEmailWithTemplate} from "../services/mailjet";

const chance = new Chance()

const EMAIL_CONFIRMATION_TEMPLATE_ID = 3101906

const validationSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  name: yup.string(),
  content: yup.string().required('Content cannot be empty'),
  scheduledTo: yup.date().required('Date to send message is required'),
  confirmationCallbackUrl: yup.string().required('Confirmation callback url is required'),
  deletionCallbackUrl: yup.string().required('Deletion callback url is required'),
})

export const createTimeCapsule = async (context: KoaContext) => {
  const { request: { body }, prisma } = context
  const { email, name, content, scheduledTo, confirmationCallbackUrl, deletionCallbackUrl } = body

  try {
    await validationSchema.validate({ email, name, content, scheduledTo, confirmationCallbackUrl, deletionCallbackUrl })

    if(!validateChosenDate(scheduledTo)) {
      context.response.status = 400
      return context.response.body = {
        errors: ['Scheduled date to receive message cannot be in the past']
      }
    }

    const timeCapsule = await prisma.timeCapsule.create({
      data: {
        email,
        name,
        content,
        emailConfirmationCode: chance.string({ pool: 'ABCDEFGHIJKLMNOPQRSTUVXWYZ1234567890', length: 6 }),
        scheduledTo: new Date(scheduledTo),
        uuid: chance.guid({ version: 5 })
      }
    })

    if (timeCapsule?.emailConfirmationCode) {
      sendConfirmationEmail({
        name: timeCapsule?.name,
        email: timeCapsule?.email,
        confirmationCode: timeCapsule?.emailConfirmationCode,
        guid: timeCapsule?.uuid,
        confirmationCallbackUrl,
        deletionCallbackUrl
      })
    }

    return context.response.body = {
      timeCapsule
    }
  } catch (err) {
    context.response.status = 400
    return context.response.body = {
      errors: err?.errors
    }
  }
}

const sendConfirmationEmail = ({name, email, confirmationCode, guid, confirmationCallbackUrl, deletionCallbackUrl}) => {
  const variables = {
    email,
    confirmationLink: `${confirmationCallbackUrl}?email=${email}&code=${confirmationCode}&guid=${guid}`,
    deletionLink: `${deletionCallbackUrl}?email=${email}&code=${confirmationCode}&guid=${guid}`
  }

  sendEmailWithTemplate(EMAIL_CONFIRMATION_TEMPLATE_ID, [{ Email: email, Name: name || '' }], '', variables).catch(err => {
    console.log('Error sending confirmation email', err)
  })
}

const validateChosenDate = (chosenDate: string | Date) => {
  const parsedDate = typeof chosenDate === 'string' ? parseISO(chosenDate) : chosenDate
  return isAfter(parsedDate, new Date())
}
