import { ApiError } from "../ApiError";
import { MapperError } from "./type";

export class GoogleSheetError extends ApiError {}

export const mapperGoogleSheetError: MapperError = (e: unknown) => {
  if (!(e instanceof GoogleSheetError)) return;
  if (e.statusCode === 401) {
    return new ApiError({
      message: "Эта ссылка не является открытой",
      statusCode: 401,
    });
  }
  if (e.statusCode === 404) {
    return new ApiError({
      message: "Такой таблицы не существует",
      statusCode: 404,
    });
  }
  if (e.statusCode >= 500) {
    return new ApiError({
      message: "Какие-то проблемы с сервисом гугл",
      statusCode: 500,
    });
  }
  return new ApiError({
    message: "Не удается получить доступ до таблицы",
    statusCode: 500,
  });
};
