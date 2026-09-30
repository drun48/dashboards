import { TypeConenction } from "../type";

export interface IStrategy {
  type: TypeConenction;
  execute(
    url: string,
    payload?: Record<string, unknown>,
  ): Record<string, unknown> | Promise<Record<string, unknown>>;
}
