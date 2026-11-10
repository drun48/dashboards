import { z } from 'zod'
import { ChartTypeContent } from '../../../generated/prisma/client'

export const createChartContentSchema = z.strictObject({
    labelColumn: z.string().min(1),
    valueColumn: z.string().min(1),
    datasetId: z.string().min(1),
    chartId: z.string().min(1),
    type: z.enum(ChartTypeContent),
})

export const updateChartContentSchema = createChartContentSchema.omit({ type: true, chartId: true })
    .partial().refine(
        (data) => {
            if (data.datasetId !== undefined) {
                return data.labelColumn !== undefined && data.valueColumn !== undefined;
            }
            return Object.values(data).some((v) => v !== undefined);
        },
        { message: "При указании datasetId нужны labelColumn и valueColumn" }
    );