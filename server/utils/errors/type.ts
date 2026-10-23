import { ApiError } from "../ApiError";

export type MapperError = (e: unknown) => ApiError | undefined;
