import { z } from 'zod'
import { createChartSchema, updateChartSchema } from './schema'

export type DTOCreateChart = z.infer<typeof createChartSchema>
export type DTOUpdateChart = z.infer<typeof updateChartSchema>
