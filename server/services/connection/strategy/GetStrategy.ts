import { TypeConenction } from "../type";
import * as strategys from "./implementation";

export function getStrategy(type: TypeConenction) {
  return Object.values(strategys).find((strategy) => strategy.type === type);
}
