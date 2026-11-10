import { z } from 'zod'
import { createChartContentSchema, updateChartContentSchema } from './schema';

export type DTOCreateChartContent = z.infer<typeof createChartContentSchema>;
export type DTOUpdateChartContent = z.infer<typeof updateChartContentSchema>;