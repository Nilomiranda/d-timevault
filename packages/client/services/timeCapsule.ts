import { httpClient } from '../config/httpClient'

interface TimeCapsuleInput {
  email: string
  content: string
  scheduledTo: string
  confirmationCallbackUrl?: string
  deletionCallbackUrl?: string
}

interface ConfirmTimeCapsuleInput {
  code: string
  email: string
  guid: string
}

export const createTimeCapsule = async (input: TimeCapsuleInput) => {
  const baseUrl = window?.location?.href

  return httpClient?.post('/time-capsules/create', {
    ...input,
    confirmationCallbackUrl: `${baseUrl}email/confirm`,
    deletionCallbackUrl: `${baseUrl}email/delete`,
  })
}

export const deleteTimeCapsule = async (input: ConfirmTimeCapsuleInput) => {
  const { code, email, guid } = input

  return httpClient?.delete(`/time-capsules/delete?code=${code}&email=${email}&guid=${guid}`)
}

export const confirmTimeCapsule = async (input: ConfirmTimeCapsuleInput) => {
  const { code, email, guid } = input

  return httpClient?.patch('/time-capsules/confirm', { code, email, guid })
}
