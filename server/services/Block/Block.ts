import { DTOcreateBlock, DTOUpdateBlock } from "./type";
import prisma from "../../db/prisma/prismaClient";
import { factoryCreateBlock, factoryUpdateBlock } from "./FactoryBlock";

export class Block {
  async create(ownerId: string, data: DTOcreateBlock) {
    return await factoryCreateBlock(ownerId, data)
  }

  async getAll(ownerId: string, dashboardId: string, page?: number, limit?: number) {
    return await prisma.block.findMany({
      where: {
        dashboardId,
        dashboard: { ownerId }
      },
      take: limit,
      skip: page && limit ? (page - 1) * limit : undefined,
    })
  }

  async update(ownerId: string, blockId: string, data: DTOUpdateBlock) {
    const { kind } = await prisma.block.findUniqueOrThrow({ select: { kind: true }, where: { id: blockId, dashboard: { ownerId } } })
    return await factoryUpdateBlock(ownerId, blockId, kind, data)
  }

  async delete(ownerId: string, blockId: string) {
    return await prisma.block.delete({ where: { id: blockId, dashboard: { ownerId } } })
  }
}


export const blockService = new Block()