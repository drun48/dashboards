import { ChartType, ChartTypeContent } from "../../../generated/prisma/client";
import prisma from "../../db/prisma/prismaClient";
import { ApiError } from "../../utils/ApiError";
import { DTOCreateChart, DTOUpdateChart } from "./type";

export class Chart {
    async create(ownerId: string, dto: DTOCreateChart) {
        const { options, ...data } = dto
        return await prisma.chart.create({
            data: {
                ...data,
                ownerId,
                options: (options ?? {})
            }
        })
    }

    async getAllChart(ownerId: string, limit?: number, page?: number) {
        return await prisma.chart.findMany({
            where: {
                ownerId
            },
            skip: page && limit ? (page - 1) * limit : undefined,
            take: limit,
        })
    }

    async getChartId(ownerId: string, chartId: string) {
        return await prisma.chart.findFirstOrThrow({
            where: { ownerId, id: chartId },
            include: {
                chartContent: true
            }
        })
    }

    async updateChart(ownerId: string, chartId: string, dto: DTOUpdateChart) {
        const { options, type, ...data } = dto
        if (!type) {
            return await prisma.chart.update({
                where: { ownerId, id: chartId },
                data: {
                    ...data,
                    ownerId,
                    ...(options ? { options } : {})
                }
            })
        }
        return await prisma.$transaction(async (tx) => {
            const [chart] = await tx.$queryRaw<{ id: string; type: ChartType }[]>`
                SELECT "id", "type"
                FROM "Chart"
                WHERE "id" = ${chartId} AND "ownerId" = ${ownerId}
                FOR UPDATE
            `;
            if (!chart) {
                throw new ApiError({
                    statusCode: 404,
                    message: "График не найден",
                });
            }
            const chartContents = await tx.chartContent.findMany({
                where: { chartId },
                select: { type: true }
            })
            if (type === ChartType.SINGL && chartContents.length > 1) {
                throw new ApiError({
                    statusCode: 400,
                    message: "Невозможно изменить тип графика на SINGL, так как уже есть несколько элементов графика",
                });
            }
            if (type === ChartType.MULTIPLE && chartContents.some(el => el.type === ChartTypeContent.DONUT || el.type === ChartTypeContent.PIE)) {
                throw new ApiError({
                    statusCode: 400,
                    message: "Невозможно изменить тип графика на MULTIPLE, так как уже есть элементы графика типа donut или pie",
                });
            }
            return await tx.chart.update({
                where: { ownerId, id: chartId },
                data: {
                    ...data,
                    type,
                    ownerId,
                    ...(options ? { options } : {})
                }
            })
        })
    }

    async deleteChart(ownerId: string, chartId: string) {
        return await prisma.chart.delete({ where: { ownerId, id: chartId } })
    }
}

export const chartService = new Chart()