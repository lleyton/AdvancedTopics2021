import { InnaticalID } from "@innatical/id";

export const id = new InnaticalID(
  process.env.INNID_ID!,
  process.env.INNID_TOKEN!
);
