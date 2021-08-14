import {httpClient} from "../config/httpClient";

interface TimeCapsuleInput {
  email: string
  content: string
  scheduledTo: string
  confirmationCallbackUrl?: string
  deletionCallbackUrl?: string
}

export const createTimeCapsule = async (input: TimeCapsuleInput) => {
  return httpClient?.post('/time-capsules/create', { ...input, confirmationCallbackUrl: 'http://localhost:4000/email/confirm', deletionCallbackUrl: 'http://localhost:4000/email/delete' })
}
