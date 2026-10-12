import * as zod from "zod"; 

export const createDataSourceSchema = zod.object({
  name: zod.string().min(1),
  link: zod.url().min(1),
  type: zod.enum(["GOOGLE_SHEET"])
});

export const updateDataSourceSchema = createDataSourceSchema
  .partial()
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "Хотя бы одно поле должно быть заполнено",
});