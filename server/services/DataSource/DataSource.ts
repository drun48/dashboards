import prisma from "../../db/prisma/prismaClient";
import { DTOCreateDataSource, DTOUpdateDataSource } from "./type";
import { check } from "../../integrations/googleSheets";

export class DataSource {
  async setDataSource(ownerId: string, data: DTOCreateDataSource) {
    await check(data.link);
    return await prisma.dataSource.create({
      data: {
        ...data,
        ownerId,
      },
    });
  }

  async getDataSource(ownerId: string, page?: number, limit?: number) {
    return prisma.dataSource.findMany({
      where: { ownerId },
      skip: page && limit ? (page - 1) * limit : undefined,
      take: limit,
    });
  }

  async getDataSourceById(ownerId: string, id: string) {
    return prisma.dataSource.findUnique({
      where: { id, ownerId },
    });
  }

  async deleteDataSourceById(ownerId: string, id: string) {
    return prisma.dataSource.delete({
      where: { id, ownerId },
    });
  }

  async updateDataSourceById(ownerId: string, id: string, data: DTOUpdateDataSource) {
    return prisma.dataSource.update({
      where: { id, ownerId },
      data: data,
    });
  }
}

export const dataSourceService = new DataSource();
