import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { ApiError } from "./ApiError";
import { ParseFormData } from "./parseFormData";
import { AppRouteHandlerRoutes } from "../../.next/dev/types/routes";

type InferData<TSchema> = TSchema extends z.ZodType
  ? z.output<TSchema>
  : undefined;

type AnyRouteContext = { params: Promise<Record<string, string | string[]>> };

type ReturnAnswer = Record<string, unknown> | undefined;

export function catchAsync<TCtx extends AnyRouteContext = AnyRouteContext>() {
  return <TSchema extends z.ZodType | undefined = undefined>(
      fn: (data: {
        req: NextRequest;
        ctx: TCtx;
        dataBody: InferData<TSchema>;
      }) => ReturnAnswer | Promise<ReturnAnswer>,
      options?: {
        schemaBody?: TSchema;
        handelError?: (e: unknown) => Response;
      },
    ) =>
    async (req: NextRequest, ctx: TCtx) => {
      const handelError =
        options?.handelError ??
        ((e: unknown) => {
          const statusCode = e instanceof ApiError ? e.statusCode : 500;
          const message =
            e instanceof ApiError ? e.message : "Упс, что-то пошло не так";
          console.error(e);
          return NextResponse.json(
            {
              ok: false,
              message,
            },
            { status: statusCode },
          );
        });
      try {
        const contentType = req.headers.get("content-type") || "";
        if (!contentType) {
          throw new ApiError({ statusCode: 400, message: "Некорректный body" });
        }
        let dataBody = undefined as InferData<TSchema>;
        if (options?.schemaBody) {
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
          const parceData = options?.schemaBody.safeParse(body);
          if (parceData.success) {
            dataBody = parceData.data as InferData<TSchema>;
          } else {
            throw new ApiError({
              statusCode: 400,
              message: z.prettifyError(parceData.error),
            });
          }
        }
        return Response.json({
          ok: true,
          ...((await fn({ req, dataBody, ctx })) ?? {}),
        });
      } catch (e) {
        return handelError(e);
      }
    };
}
