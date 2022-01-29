import { z } from 'zod'

export const CreateAppValidator = z.object({
  name: z.string().max(32),
  repo: z.string().max(128),
  model: z.enum(['LIGHT', 'BASIC', 'PLUS', 'UBER']),
  minReplicas: z.number().int().min(1),
  maxReplicas: z.number().int().min(1),
})
