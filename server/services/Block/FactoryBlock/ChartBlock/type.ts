import { z } from 'zod'
import { createBlockSchema, updateBlockSchema } from './schema';

export type DTOcreateChartBlock = z.infer<typeof createBlockSchema>
export type DTOUpdateChartBlock = z.infer<typeof updateBlockSchema>