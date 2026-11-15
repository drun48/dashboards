import { datasetService } from "../../services/Dataset/Dataset";
import { catchAsync } from "../../utils/catchAync";
import { mapperGoogleSheetError } from "../../utils/errors/mapperGoogleSheetError";
import { mapperPrismaError } from "../../utils/errors/mapperPrismaError";
import { getSessionOrThrow } from "../../utils/getSessionOrThrow";
import { parseBody } from "../../utils/parseBody";
import { parseQuery } from "../../utils/parseQuery";
import { paginationSchema } from "../validation";
import { createDataseteSchema, updateDatasetSchema } from "./validation";

export const createDataset = catchAsync(
  async (req) => {
    const body = await parseBody(req, createDataseteSchema);
    const { idUser } = await getSessionOrThrow()
    return await datasetService.create(idUser, body);
  },
  [mapperGoogleSheetError, mapperPrismaError],
);

export const getDatasets = catchAsync(
  async (req) => {
    const { page, limit } = await parseQuery(req, paginationSchema);
    const { idUser } = await getSessionOrThrow()
    return datasetService.getDataset(idUser, page, limit);
  },
  [mapperPrismaError],
);

export const getDatasetById = catchAsync<RouteContext<"/api/dataset/[id]">>(
  async (_, ctx) => {
    const { id } = await ctx.params;
    const { idUser } = await getSessionOrThrow()
    return datasetService.getDatasetId(idUser, id);
  },
  [mapperPrismaError],
);

export const updateDatasetById = catchAsync<RouteContext<"/api/dataset/[id]">>(
  async (req, ctx) => {
    const body = await parseBody(req, updateDatasetSchema);
    const { id } = await ctx.params;
    const { idUser } = await getSessionOrThrow()
    return datasetService.updateDatasetId(idUser, id, body);
  },
  [mapperPrismaError],
);

export const deleteDatasetById = catchAsync<RouteContext<"/api/dataset/[id]">>(
  async (_, ctx) => {
    const { id } = await ctx.params;
    const { idUser } = await getSessionOrThrow()
    return datasetService.delete(idUser, id);
  },
  [mapperPrismaError],
);

export const getPreview = catchAsync<RouteContext<"/api/dataset/preview/[id]">>(
  async (req, ctx) => {
    const { page, limit } = await parseQuery(req, paginationSchema);
    const { id } = await ctx.params;
    const { idUser } = await getSessionOrThrow()
    return datasetService.getPreview(idUser, id, page, limit);
  },
  [mapperPrismaError, mapperGoogleSheetError],
);

export const getAllData = catchAsync<RouteContext<"/api/dataset/all/[id]">>(
  async (_, ctx) => {
    const { id } = await ctx.params;
    const { idUser } = await getSessionOrThrow()
    return datasetService.getDataAllSnapshot(idUser, id);
  },
  [mapperPrismaError, mapperGoogleSheetError],
);

export const refresh = catchAsync<RouteContext<"/api/dataset/refresh/[id]">>(
  async (_, ctx) => {
    const { id } = await ctx.params;
    const { idUser } = await getSessionOrThrow()
    return datasetService.refresData(idUser, id);
  },
  [mapperPrismaError, mapperGoogleSheetError],
);
