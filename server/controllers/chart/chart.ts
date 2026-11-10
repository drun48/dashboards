import { catchAsync } from "../../utils/catchAync";
import { mapperPrismaError } from "../../utils/errors/mapperPrismaError";
import { parseBody } from "../../utils/parseBody";
import { createChartSchema, updateChartSchema } from "../../services/Chart/schema";
import { paginationSchema } from "../validation";
import { parseQuery } from "../../utils/parseQuery";
import { chartService } from "../../services/Chart/Chart";

type ChartContext = { params: Promise<{ id: string }> };

export const createChart = catchAsync(
    async (req) => {
        const body = await parseBody(req, createChartSchema);
        return await chartService.create("1", body);
    },
    [mapperPrismaError],
);

export const getAllChart = catchAsync(
    async (req) => {
        const { page, limit } = await parseQuery(req, paginationSchema);
        return chartService.getAllChart("1", limit, page);
    },
    [mapperPrismaError],
);

export const getChartId = catchAsync<ChartContext>(
    async (_, ctx) => {
        const { id } = await ctx.params;
        return chartService.getChartId("1", id);
    },
    [mapperPrismaError],
);


export const updateChart = catchAsync<ChartContext>(
    async (req, ctx) => {
        const body = await parseBody(req, updateChartSchema);
        const { id } = await ctx.params;
        return await chartService.updateChart("1", id, body);
    },
    [mapperPrismaError],
);

export const deleteChart = catchAsync<ChartContext>(
    async (_, ctx) => {
        const { id } = await ctx.params;
        return chartService.deleteChart("1", id);
    },
    [mapperPrismaError],
);
