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

export const createTimeCapsule = async (input: TimeCapsuleInput) => httpClient?.post('/time-capsules/create', { ...input, confirmationCallbackUrl: 'http://localhost:4000/email/confirm', deletionCallbackUrl: 'http://localhost:4000/email/delete' })

export const deleteTimeCapsule = async (input: ConfirmTimeCapsuleInput) => {
  const { code, email, guid } = input

  return httpClient?.delete(`/time-capsules/delete?code=${code}&email=${email}&guid=${guid}`)
}

export const confirmTimeCapsule = async (input: ConfirmTimeCapsuleInput) => {
  const { code, email, guid } = input

  return httpClient?.patch('/time-capsules/confirm', { code, email, guid })
}
