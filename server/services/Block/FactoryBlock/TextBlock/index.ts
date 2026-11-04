import prisma from "../../../../db/prisma/prismaClient";
import { updateBlockSchema } from "./schema";
import { DTOcreateTextBlock, DTOUpdateTextBlock } from "./type";

export const createTextBlock = async (ownerId: string, data: DTOcreateTextBlock) => {
    const { dashboardId, ...block } = data
    return await prisma.block.create({
        data: { ...block, dashboard: { connect: { id: dashboardId, ownerId } } }
    })
}

export const updateTextBlock = async (ownerId: string, blockId: string, dto: DTOUpdateTextBlock) => {
    const data = updateBlockSchema.parse(dto)
    return await prisma.block.update({
        where: { id: blockId, dashboard: { ownerId } },
        data: { ...data }
    })
}