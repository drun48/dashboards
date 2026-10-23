import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "./ApiError";
import { MapperError } from "./errors/type";
import { mapperDefaultError } from "./errors/mapperDefaultError";

export type AnyRouteContext = {
  params: Promise<Record<string, string | string[]>>;
};

export function catchAsync<TCtx extends AnyRouteContext = AnyRouteContext>(
  fn: (req: NextRequest, ctx: TCtx) => unknown | Promise<unknown>,
  mapperErrors: MapperError[] = [],
) {
  return async (req: NextRequest, ctx: TCtx) => {
    const mapperErrorsWithDefault = [...mapperErrors, mapperDefaultError];
    try {
      return NextResponse.json({
        ok: true,
        data: await fn(req, ctx),
      });
    } catch (e) {
      const { message, statusCode } = mapperErrorsWithDefault
        .map((mapper) => mapper(e))
        .find(Boolean) as ApiError;
      console.error(message, statusCode);
      return NextResponse.json(
        {
          ok: false,
          message,
        },
        { status: statusCode },
      );
    }
  };
}
