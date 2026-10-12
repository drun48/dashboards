import { NextRequest } from "next/server";
import { ApiError } from "../utils/ApiError";
import { ParseFormData } from "./parseFormData";
import z from "zod";

type InferData<TSchema> = z.output<TSchema>;

export async function parseBody<TSchema extends z.ZodType>(
  req: NextRequest,
  schema: TSchema,
) {
  const contentType = req.headers.get("content-type") || "";
  if (!contentType) {
    throw new ApiError({ statusCode: 400, message: "Некорректный body" });
  }
  let body;
  if (contentType.includes("application/json")) {
    body = await req.json().catch(() => {
      throw new ApiError({
        statusCode: 400,
        message: "Некорректный body",
      });
    });
  } else {
    const formData = await req.formData().catch(() => {
      throw new ApiError({
        statusCode: 400,
        message: "Некорректный body",
      });
    });
    body = ParseFormData(formData);
  }
  const parceData = schema.safeParse(body);
  if (!parceData.success) {
    throw new ApiError({
      statusCode: 400,
      message: z.prettifyError(parceData.error),
    });
  }
  return parceData.data as InferData<TSchema>;
}
