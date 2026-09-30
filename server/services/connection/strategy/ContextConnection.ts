import { IStrategy } from "./IStrategy";

export class ContextConnection {
  private strategy: IStrategy;

  constructor(strategy: IStrategy) {
    this.strategy = strategy;
  }

  execute(url: string, payload?:Record<string, unknown>) {
    return this.strategy.execute(url, payload);
  }
}
