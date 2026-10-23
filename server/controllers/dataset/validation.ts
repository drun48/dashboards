import { z } from "zod";

export const createDataseteSchema = z.object({
  name: z.string().min(1),
  dataSourceId: z.string().min(1),
  columnsIsFirstRow: z.stringbool().default(false),
});

export const updateDatasetSchema = createDataseteSchema
  .pick({ name: true })
  .partial()
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "Хотя бы одно поле должно быть заполнено",
  });
