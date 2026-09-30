import prisma from "../../lib/prisma";

export class Connection {
  async getConnection() {
    const connection = await prisma.dataSource.findMany();
    return connection;
  }

  setConnection(data) {

  }

  deleteConnection() {}
}
