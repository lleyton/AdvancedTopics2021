import { User } from "@prisma/client";

export const port = 3001;
export type Context = { user?: User };
