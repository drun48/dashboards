import prisma from "../../db/prisma/prismaClient";
import { DTOCreateDataSource, DTOUpdateDataSource } from "./type";
import { updateDataSourceSchema } from "../../controllers/dataSource/validation";

export class DataSource {
  async setDataSource(ownerId: string, data: DTOCreateDataSource) {
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

  async getDataSourceById(id: string) {
    return prisma.dataSource.findUnique({
      where: { id },
    });
  }

  async deleteDataSourceById(id: string, ownerId: string) {
    return prisma.dataSource.delete({
      where: { id, ownerId },
    });
  }

  async updateDataSourceById(
    id: string,
    ownerId: string,
    data: DTOUpdateDataSource,
  ) {
    const parsedData = updateDataSourceSchema.parse(data);
    return prisma.dataSource.update({
      where: { id, ownerId },
      data: parsedData,
    });
  }
}

export const dataSourceService = new DataSource();
