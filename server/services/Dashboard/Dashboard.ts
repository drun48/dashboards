import { DTOCreateDashboard, DTOUpdateDashboard } from "./type";
import prisma from "../../db/prisma/prismaClient";

export class Dashboard {
  async create(ownerId: string, data: DTOCreateDashboard) {
    return prisma.dashboard.create({ data: { ...data, ownerId } });
  }

  async getDashboards(ownerId: string, page?: number, limit?: number) {
    return prisma.dashboard.findMany({
      where: { ownerId },
      skip: page && limit ? (page - 1) * limit : undefined,
      take: limit,
    });
  }

  async getDashboardId(ownerId: string, id: string) {
    return prisma.dashboard.findUniqueOrThrow({ where: { id, ownerId } });
  }

  async updateDashboard(ownerId: string, id: string, data: DTOUpdateDashboard) {
    return prisma.dashboard.update({ where: { id, ownerId }, data });
  }

  async deleteDashboard(ownerId: string, id: string) {
    return prisma.dashboard.delete({ where: { id, ownerId } });
  }
}

export const dashboardService = new Dashboard();