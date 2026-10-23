import { z } from "zod";

export const paginationSchema = z.object({
  limit: z.coerce.number().int("Должно быть целым числом").min(1).optional(),
  page: z.coerce.number().int("Должно быть целым числом").min(1).optional(),
});
