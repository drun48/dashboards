import { catchAsync } from "../../utils/catchAync";
import { mapperPrismaError } from "../../utils/errors/mapperPrismaError";
import { parseBody } from "../../utils/parseBody";
import { createChartContentSchema, updateChartContentSchema } from "../../services/ChartContent/schema";
import { chartContentService } from "../../services/ChartContent/ChartContent";

type ChartContentContext = { params: Promise<{ id: string }> };

export const createChartContent = catchAsync(
    async (req) => {
        const body = await parseBody(req, createChartContentSchema);
        return await chartContentService.create("1", body);
    },
    [mapperPrismaError],
);

export const updateChartContent = catchAsync<ChartContentContext>(
    async (req, ctx) => {
        const body = await parseBody(req, updateChartContentSchema);
        const { id } = await ctx.params;
        return chartContentService.update("1", id, body);
    },
    [mapperPrismaError],
);

export const deleteChartContent = catchAsync<ChartContentContext>(
    async (_, ctx) => {
        const { id } = await ctx.params;
        return chartContentService.delete("1", id);
    },
    [mapperPrismaError],
);