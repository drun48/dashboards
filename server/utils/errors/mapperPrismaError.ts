import { Prisma } from "../../../generated/prisma/client";
import { ApiError } from "../ApiError";

export const mapperPrismaError = (e: unknown) => {
  if (!(e instanceof Prisma.PrismaClientKnownRequestError)) return;
  switch (e.code) {
    case "P2025":
      return new ApiError({ statusCode: 404, message: "Запись не найдена" });
    case "P2002":
      return new ApiError({
        statusCode: 409,
        message: "Такая запись уже существует",
      });
    case "P2003":
      return new ApiError({
        statusCode: 409,
        message: "Связанная запись не найдена",
      });
  }
};
