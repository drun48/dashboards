import { ApiError } from "../ApiError";

export const mapperDefaultError = (e: unknown) => {
  const statusCode = e instanceof ApiError ? e.statusCode : 500;
  const message = e instanceof Error ? e.message : "Упс, что-то пошло не так";
  console.error(e);
  return new ApiError({ statusCode, message });
};
