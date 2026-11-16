import { NextRequest } from "next/server";
import { ApiError } from "../utils/ApiError";
import z from "zod";

export async function parseQuery<TSchema extends z.ZodType>(
  req: NextRequest,
  schema: TSchema,
) {
  const searchParams = req.nextUrl.searchParams
  const query: Record<string, unknown> = {}
  for (const key of searchParams.keys()) {
    const values = searchParams.getAll(key);
    query[key] = values.length > 1 ? values : values[0];
  }
  const parseData = schema.safeParse(query);
  if (!parseData.success) {
    throw new ApiError({
      statusCode: 400,
      message: "Неверный формат query параметров",
    });
  }

  return parseData.data;
}
