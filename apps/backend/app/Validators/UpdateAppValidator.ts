import { z } from 'zod'

export const UpdateAppValidator = z.object({
  name: z.string().max(32).optional(),
  repo: z.string().max(128).optional(),
  model: z.enum(['LIGHT', 'BASIC', 'PLUS', 'UBER']).optional(),
  minReplicas: z.number().int().min(1).optional(),
  maxReplicas: z.number().int().min(1).optional(),
})
