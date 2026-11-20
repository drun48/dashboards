import { z } from "zod";

export const createDashboardSchema = z.object({
    title:z.string().min(3),
})

export const updateDashboardSchema = createDashboardSchema