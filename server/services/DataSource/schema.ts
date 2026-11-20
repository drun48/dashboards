import { z } from 'zod'
import { SourceType } from "../../../generated/prisma/enums";

export const createDataSourceSchema = z.object({
  name: z.string().min(1),
  link: z.url().min(1),
  type: z.enum(SourceType),
});

export const updateDataSourceSchema = createDataSourceSchema
  .partial()
  .pick({ name: true })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "Хотя бы одно поле должно быть заполнено",
  });
