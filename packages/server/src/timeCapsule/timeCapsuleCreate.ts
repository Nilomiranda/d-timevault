import {KoaContext} from "../globalInterfaces";
import * as yup from 'yup'
import Chance from 'chance'
import {isAfter, parseISO} from "date-fns";

const chance = new Chance()

const validationSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  name: yup.string(),
  content: yup.string().required('Content cannot be empty'),
  scheduledTo: yup.date().required('Date to send message is required')
})

export const createTimeCapsule = async (context: KoaContext) => {
  const { request: { body }, prisma } = context
  const { email, name, content, scheduledTo } = body

  try {
    await validationSchema.validate({ email, name, content, scheduledTo })

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
      }
    })


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

const validateChosenDate = (chosenDate: string | Date) => {
  const parsedDate = typeof chosenDate === 'string' ? parseISO(chosenDate) : chosenDate
  return isAfter(parsedDate, new Date())
}
