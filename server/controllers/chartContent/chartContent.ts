import { catchAsync } from "../../utils/catchAync";
import { mapperPrismaError } from "../../utils/errors/mapperPrismaError";
import { parseBody } from "../../utils/parseBody";
import { createChartContentSchema, updateChartContentSchema } from "../../services/ChartContent/schema";
import { chartContentService } from "../../services/ChartContent/ChartContent";
import { getSessionOrThrow } from "../../utils/getSessionOrThrow";

type ChartContentContext = { params: Promise<{ id: string }> };

export const createChartContent = catchAsync(
    async (req) => {
        const body = await parseBody(req, createChartContentSchema);
        const { idUser } = await getSessionOrThrow()
        return await chartContentService.create(idUser, body);
    },
    [mapperPrismaError],
);

export const updateChartContent = catchAsync<ChartContentContext>(
    async (req, ctx) => {
        const body = await parseBody(req, updateChartContentSchema);
        const { id } = await ctx.params;
        const { idUser } = await getSessionOrThrow()
        return chartContentService.update(idUser, id, body);
    },
    [mapperPrismaError],
);

export const deleteChartContent = catchAsync<ChartContentContext>(
    async (_, ctx) => {
        const { id } = await ctx.params;
        const { idUser } = await getSessionOrThrow()
        return chartContentService.delete(idUser, id);
    },
    [mapperPrismaError],
);