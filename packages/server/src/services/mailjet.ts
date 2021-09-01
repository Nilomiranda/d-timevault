import mailjet from 'node-mailjet'

export const sendEmailWithTemplate = async (templateId: number, to: {Email: string; Name: string}[], subject = '', variables = {}) => {
  if (!templateId || !to?.length) {
    return
  }

  const mailjetClient = mailjet.connect(process.env.MAILJET_API_KEY, process.env.MAILJET_SECRET_KEY)

  return mailjetClient.post('send', { version: 'v3.1' }).request({
    Messages:[
      {
        From: {
          Email: process.env.EMAIL_SENDER_ADDRESS,
          Name: "no-reply"
        },
        To: to,
        TemplateID: templateId,
        TemplateLanguage: true,
        Subject: "Time capsule confirmation",
        Variables: variables,
      }
    ]
  })
}

