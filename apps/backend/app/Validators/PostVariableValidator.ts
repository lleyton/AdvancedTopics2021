import { z } from 'zod'

export const PostVariableValidator = z.object({
  usage: z.enum(['BUILD', 'RUN']),
  scope: z.enum(['PREVIEW', 'PRODUCTION']),
  name: z.string(),
  value: z.string(),
})
