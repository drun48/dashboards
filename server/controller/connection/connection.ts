import { NextApiRequest, NextApiResponse } from "next";
import { SchemaConnectionCreate } from "./schemas";

export class ConnectionController {
  getConnection() {}

  getDataConnection() {}

  createConnection(req: NextApiRequest, res: NextApiResponse) {
    const { body } = req;
    const { success, error } = SchemaConnectionCreate.safeParse(body);

    if (error) {
      return res.status(400).json({ ok: false, error: error.message });
    }
  }

  deleteConnection() {}
}
