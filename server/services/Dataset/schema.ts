import { z } from 'zod'

export const paramsFilterColumnGetAllData = z.object({
    columns: z.string().or(z.array(z.string())).optional().transform((val) => {
        if (!val) return []
        return typeof val === "string" ? [val] : val
    })
})
