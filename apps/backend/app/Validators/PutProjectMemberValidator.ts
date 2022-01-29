import { z } from 'zod'

export const PutProjectMemberValidator = z.object({
  role: z.enum(['OWNER', 'ADMIN', 'NORMAL']),
})
