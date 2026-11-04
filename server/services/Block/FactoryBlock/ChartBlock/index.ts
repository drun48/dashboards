
import prisma from "../../../../db/prisma/prismaClient";
import { updateBlockSchema } from "./schema";
import { DTOcreateChartBlock, DTOUpdateChartBlock } from "./type";


export const createChartBlock = async (ownerId: string, data: DTOcreateChartBlock) => {
    const { dashboardId, chartId, ...block } = data
    return await prisma.block.create({
        data: { ...block, chart: { connect: { id: chartId, ownerId } }, dashboard: { connect: { id: dashboardId, ownerId } } }
    })
}

export const updateChartBlock = async (ownerId: string, blockId: string, dto: DTOUpdateChartBlock) => {
    const data = updateBlockSchema.parse(dto)
    const { chartId, ...block } = data
    return await prisma.block.update({
        where: { id: blockId, dashboard: { ownerId } },
        data: {
            ...block,
            ...(chartId !== undefined
                ? { chart: { connect: { id: chartId, ownerId } } }
                : {}),
        }
    })
}