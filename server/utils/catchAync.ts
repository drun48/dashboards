import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "./ApiError";

export type AnyRouteContext = {
  params: Promise<Record<string, string | string[]>>;
};

export function catchAsync<TCtx extends AnyRouteContext = AnyRouteContext>(
  fn: (req: NextRequest, ctx: TCtx) => unknown | Promise<unknown>,
  fnError?: (e: unknown) => Response,
) {
  return async (req: NextRequest, ctx: TCtx) => {
    const handelError =
      fnError ??
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
      return NextResponse.json({
        ok: true,
        data: await fn(req, ctx),
      });
    } catch (e) {
      return handelError(e);
    }
  };
}
