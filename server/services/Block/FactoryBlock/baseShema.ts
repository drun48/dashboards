import { z } from "zod";

export const blockBaseShema = z.object({
    x: z.number().int().min(0),
    y: z.number().int().min(0),
    h: z.number().int().min(1),
    w: z.number().int().min(1),
})

export const createBlockBaseShema = blockBaseShema.extend({
    dashboardId: z.string().min(1)
})