import { catchAsync } from "../../utils/catchAync";
import { mapperPrismaError } from "../../utils/errors/mapperPrismaError";
import { parseBody } from "../../utils/parseBody";
import { createChartSchema, updateChartSchema } from "../../services/Chart/schema";
import { paginationSchema } from "../validation";
import { parseQuery } from "../../utils/parseQuery";
import { chartService } from "../../services/Chart/Chart";
import { getSessionOrThrow } from "../../utils/getSessionOrThrow";

type ChartContext = { params: Promise<{ id: string }> };

export const createChart = catchAsync(
    async (req) => {
        const body = await parseBody(req, createChartSchema);
        const { idUser } = await getSessionOrThrow()
        return await chartService.create(idUser, body);
    },
    [mapperPrismaError],
);

export const getAllChart = catchAsync(
    async (req) => {
        const { page, limit } = await parseQuery(req, paginationSchema);
        const { idUser } = await getSessionOrThrow()
        return chartService.getAllChart(idUser, limit, page);
    },
    [mapperPrismaError],
);

export const getChartId = catchAsync<ChartContext>(
    async (_, ctx) => {
        const { id } = await ctx.params;
        const { idUser } = await getSessionOrThrow()
        return chartService.getChartId(idUser, id);
    },
    [mapperPrismaError],
);


export const updateChart = catchAsync<ChartContext>(
    async (req, ctx) => {
        const body = await parseBody(req, updateChartSchema);
        const { id } = await ctx.params;
        const { idUser } = await getSessionOrThrow()
        return await chartService.updateChart(idUser, id, body);
    },
    [mapperPrismaError],
);

export const deleteChart = catchAsync<ChartContext>(
    async (_, ctx) => {
        const { id } = await ctx.params;
        const { idUser } = await getSessionOrThrow()
        return chartService.deleteChart(idUser, id);
    },
    [mapperPrismaError],
);
