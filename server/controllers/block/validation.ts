import { z } from 'zod'
import { paginationSchema } from '../validation'

export const queryGetAllShema = paginationSchema.extend({
    dashboardId: z.string().min(1)
})