import { z } from 'zod'
import { createBlockSchema, updateBlockSchema } from "./shema";


export type DTOcreateBlock = z.infer<typeof createBlockSchema>;
export type DTOUpdateBlock = z.infer<typeof updateBlockSchema>