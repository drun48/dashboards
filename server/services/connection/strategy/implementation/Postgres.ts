import { TypeConenction } from "../../type";
import { IStrategy } from "../IStrategy";
import { Client } from "pg";

export class PostgresStrategy implements IStrategy {
  static type = TypeConenction.PostgreSQL;
  async execute(url: string, payload: { selector: string }) {
    if (!payload.selector) {
      throw new Error("Отсутствует селектор");
    }
    const connectionPG = await new Client({ connectionString: url }).connect();
    const res = await connectionPG.query(payload.selector);
    await connectionPG.end();
    return res.rows.reduce(
      (data, el, index) => {
        const field = res.fields[index].name;
        if (!(field in data)) {
          data[field] = [];
        }
        data[field].push(el);
        return data;
      },
      {} as Record<string, unknown>,
    );
  }
}
