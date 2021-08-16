import {KoaContext} from "../globalInterfaces";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  code: yup.string().required('Code is required'),
  guid: yup.string().required('GUID is required'),
})

export const deleteTimeCapsule = async (context: KoaContext) => {
  const { request: { query } } = context
  const { email, code, guid } = query;

  try {
    await validationSchema.validate({ email, code, guid })

    const timeCapsule = await context.prisma.timeCapsule.findFirst({
      rejectOnNotFound: false,
      where: {
        AND: { email: <string>email, emailConfirmationCode: <string>code, uuid: <string>guid }
      }
    })

    if (!timeCapsule) {
      context.response.status = 404
      return context.response.body = {
        errors: ['Not found']
      }
    }

    await context.prisma.timeCapsule.delete({ where: { id: timeCapsule?.id } })

    return context.response.status = 201
  } catch (err) {
    context.response.status = 400
    return context.response.body = {
      errors: err?.errors
    }
  }
}
