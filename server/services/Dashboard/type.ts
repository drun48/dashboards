import { z } from "zod";
import { createDashboardSchema, updateDashboardSchema } from "./schema";

export type DTOCreateDashboard = z.infer<typeof createDashboardSchema>
export type DTOUpdateDashboard = z.infer<typeof updateDashboardSchema>