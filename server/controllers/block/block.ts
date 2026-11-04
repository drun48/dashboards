import { blockService } from "../../services/Block/Block";
import { createBlockSchema, updateBlockSchema } from "../../services/Block/shema";
import { catchAsync } from "../../utils/catchAync";
import { mapperPrismaError } from "../../utils/errors/mapperPrismaError";
import { parseBody } from "../../utils/parseBody";
import { parseQuery } from "../../utils/parseQuery";
import { queryGetAllShema } from "./validation";


type DashboardContext = { params: Promise<{ id: string }> };

export const createBlock = catchAsync(
  async (req) => {
    const body = await parseBody(req, createBlockSchema);
    return await blockService.create("1", body);
  },
  [mapperPrismaError],
);

export const getAllBlocks = catchAsync(
  async (req) => {
    const { page, limit, dashboardId } = await parseQuery(req, queryGetAllShema);
    return blockService.getAll("1", dashboardId, page, limit);
  },
  [mapperPrismaError],
);


export const updateBlock = catchAsync<DashboardContext>(
  async (req, ctx) => {
    const body = await parseBody(req, updateBlockSchema);
    const { id } = await ctx.params;
    return blockService.update("1", id, body);
  },
  [mapperPrismaError],
);

export const deleteBlock = catchAsync<DashboardContext>(
  async (_, ctx) => {
    const { id } = await ctx.params;
    return blockService.delete("1", id);
  },
  [mapperPrismaError],
);
