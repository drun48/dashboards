import { blockService } from "../../services/Block/Block";
import { createBlockSchema, updateBlockSchema } from "../../services/Block/shema";
import { catchAsync } from "../../utils/catchAync";
import { mapperPrismaError } from "../../utils/errors/mapperPrismaError";
import { parseBody } from "../../utils/parseBody";
import { parseQuery } from "../../utils/parseQuery";
import { queryGetAllShema } from "./validation";
import { getSessionOrThrow } from "../../utils/getSessionOrThrow";


type DashboardContext = { params: Promise<{ id: string }> };

export const createBlock = catchAsync(
  async (req) => {
    const body = await parseBody(req, createBlockSchema);
    const { idUser } = await getSessionOrThrow()
    return await blockService.create(idUser, body);
  },
  [mapperPrismaError],
);

export const getAllBlocks = catchAsync(
  async (req) => {
    const { page, limit, dashboardId } = await parseQuery(req, queryGetAllShema);
    const { idUser } = await getSessionOrThrow()
    return blockService.getAll(idUser, dashboardId, page, limit);
  },
  [mapperPrismaError],
);


export const updateBlock = catchAsync<DashboardContext>(
  async (req, ctx) => {
    const body = await parseBody(req, updateBlockSchema);
    const { id } = await ctx.params;
    const { idUser } = await getSessionOrThrow()
    return blockService.update(idUser, id, body);
  },
  [mapperPrismaError],
);

export const deleteBlock = catchAsync<DashboardContext>(
  async (_, ctx) => {
    const { id } = await ctx.params;
    const { idUser } = await getSessionOrThrow()
    return blockService.delete(idUser, id);
  },
  [mapperPrismaError],
);
