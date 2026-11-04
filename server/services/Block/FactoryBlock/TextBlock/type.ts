import { z } from 'zod'
import { createBlockSchema, updateBlockSchema } from './schema';

export type DTOcreateTextBlock = z.infer<typeof createBlockSchema>
export type DTOUpdateTextBlock = z.infer<typeof updateBlockSchema>