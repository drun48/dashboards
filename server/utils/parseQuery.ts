import { NextRequest } from "next/server";
import { ApiError } from "../utils/ApiError";
import z from "zod";

export async function parseQuery<TSchema extends z.ZodType>(
  req: NextRequest,
  schema: TSchema,
) {
  const query = Object.fromEntries(req.nextUrl.searchParams)
  const parseData = schema.safeParse(query);
  if (!parseData.success) {
    throw new ApiError({
      statusCode: 400,
      message: "Неверный формат query параметров",
    });
  }

  return parseData.data;
}
