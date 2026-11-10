import { z } from 'zod'
import { ChartType } from '../../../generated/prisma/client'

export const createChartSchema = z.strictObject({
    title: z.string().min(3),
    type: z.enum(ChartType),
    options: z.json().optional()
})

export const updateChartSchema = createChartSchema
    .partial()
    .refine((data) => Object.values(data).some((value) => value !== undefined), {
        message: "Хотя бы одно поле должно быть заполнено",
    });