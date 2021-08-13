import {KoaContext} from "../globalInterfaces";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  code: yup.string().required('Code is required'),
  guid: yup.string().required('GUID is required'),
})

export const updateTimeCapsule = async (context: KoaContext) => {
  const { request: { body } } = context
  const { email, code, guid } = body

  try {
    await validationSchema.validate({ email, code, guid })

    const timeCapsule = await context.prisma.timeCapsule.findFirst({
      rejectOnNotFound: false,
      where: {
        AND: { email, emailConfirmationCode: code, uuid: guid }
      }
    })

    if (!timeCapsule) {
      context.response.status = 404
      return context.response.body = {
        errors: ['Not found']
      }
    }

    console.log('timeCapsule', timeCapsule?.id, timeCapsule?.uuid)


    const confirmedTimeCapsule = await context.prisma.timeCapsule.update({
      where: {
        id: timeCapsule?.id
      },
      data: {
        emailConfirmationCode: '',
        emailConfirmed: true,
      }
    })

    console.log('confirmedTimeCapsule', confirmedTimeCapsule)

    context.response.status = 200
    return context.response.body = {
      timeCapsule: confirmedTimeCapsule
    }
  } catch (err) {
    context.response.status = 400
    return context.response.body = {
      errors: err?.errors
    }
  }
}
