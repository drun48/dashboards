
import { ChartType, ChartTypeContent } from "../../../generated/prisma/client";
import prisma from "../../db/prisma/prismaClient";
import { ApiError } from "../../utils/ApiError";
import type { Prisma } from "../../../generated/prisma/client"
import { DTOCreateChartContent, DTOUpdateChartContent } from "./type";
import { connect } from "http2";
import { sources } from "next/dist/compiled/webpack/webpack";
import { datasetService } from "../Dataset/Dataset";
// import {} from 

export class ChartContent {
    async create(ownerId: string, dto: DTOCreateChartContent) {
        const { chartId, datasetId, ...data } = dto
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
            if (chart.type === ChartType.MULTIPLE &&
                (data.type === ChartTypeContent.DONUT || data.type === ChartTypeContent.PIE)) {
                throw new ApiError({ statusCode: 400, message: "Этот тип графика нельзя использовать для режима MULTIPLE" })
            }
            const count = await tx.chartContent.count({
                where: { chartId },
            });
            const limit = chart.type === ChartType.SINGL ? 1 : 5;
            if (count >= limit) {
                throw new ApiError({
                    statusCode: 409,
                    message: `Достигнут лимит: ${limit}`,
                });
            }
            await this.checkColumnsThrow(ownerId, datasetId, [data.labelColumn, data.valueColumn], tx)
            return await tx.chartContent.create({
                data: { ...data, chart: { connect: { id: chartId, ownerId } }, dataset: { connect: { id: datasetId, source: { ownerId } } } }
            })
        })
    }

    async getDataChartContent(ownerId: string, idChartContent: string) {
        const { datasetId, labelColumn, valueColumn } = await prisma.chartContent.findFirstOrThrow({
            where: {
                id: idChartContent,
                chart: { ownerId }
            },
        })
        if (!datasetId) {
            throw new ApiError({
                statusCode: 404,
                message: "Датасет отсутствует",
            });
        }
        const { snapshot } = await datasetService.getDataAllSnapshot(ownerId, datasetId, [labelColumn, valueColumn])
        if (!snapshot) {
            throw new ApiError({
                statusCode: 404,
                message: "Данные датасета отсутствует",
            });
        }
        return {
            labelColumn: labelColumn,
            valueColumn: valueColumn,
            rowsCount: snapshot.rowCount,
            labelColumnData: snapshot.rows.map(row => row[0]),
            valueColumnData: snapshot.rows.map(row => row[1])
        }
    }

    async update(ownerId: string, chartContentId: string, dto: DTOUpdateChartContent) {
        const { datasetId: datasetIdResult, ...data } = dto
        if (data?.labelColumn || data?.valueColumn) {
            let datasetId = datasetIdResult
            if (!datasetId) {
                const result = await prisma.chartContent.findUniqueOrThrow({ where: { id: chartContentId, chart: { ownerId } }, select: { datasetId: true } })
                if (!result.datasetId) throw new ApiError({ statusCode: 404, message: 'Датасет отсутствует' })
                datasetId = result.datasetId
            }
            await this.checkColumnsThrow(ownerId, datasetId,
                [data.labelColumn, data.valueColumn].filter(el => !!el) as string[], prisma)
        }
        return prisma.chartContent.update({
            where: { id: chartContentId, chart: { ownerId } }, data: {
                ...data,
                ...(datasetIdResult !== undefined ?
                    { dataset: { connect: { id: datasetIdResult, source: { ownerId } } } } :
                    {})
            }
        })
    }

    async delete(ownerId: string, chartContentId: string) {
        return await prisma.chartContent.delete({ where: { id: chartContentId, chart: { ownerId } } })
    }

    async checkColumnsThrow(ownerId: string, datasetId: string, columns: string[], db: Prisma.TransactionClient) {
        const check = async () => {
            const result = await db.datasetSnapshot.findUnique({ where: { datasetId, dataset: { source: { ownerId } } }, select: { columns: true } })
            if (!result) return false
            const columnsSnapshotCheck = new Set(result.columns as string[])
            return columns.every((el) => columnsSnapshotCheck.has(el))
        }
        if (!(await check())) {
            throw new ApiError({ message: 'Не верно переданые колонки или такого датасета не сущестует', statusCode: 404 })
        }
    }
}

export const chartContentService = new ChartContent()