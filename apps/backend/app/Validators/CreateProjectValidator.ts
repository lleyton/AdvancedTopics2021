import { z } from 'zod'

export const CreateProjectValidator = z.object({
  name: z.string().max(32),
})
