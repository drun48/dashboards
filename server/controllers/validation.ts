import { z } from "zod";

export const paginationSchema = z
  .object({
    limit: z.coerce.number().int("Должно быть целым числом").min(1).optional(),
    page: z.coerce.number().int("Должно быть целым числом").min(1).optional(),
  })
  .refine(
    (data) => {
      const hasLimit = data.limit !== undefined;
      const hasPage = data.page !== undefined;

      return hasLimit === hasPage;
    },
    {
      message: "Параметры limit и page не правильно были переданы",
    },
  );
