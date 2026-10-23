import { datasetService } from "../../services/Dataset/Dataset";
import { catchAsync } from "../../utils/catchAync";
import { mapperGoogleSheetError } from "../../utils/errors/mapperGoogleSheetError";
import { mapperPrismaError } from "../../utils/errors/mapperPrismaError";
import { parseBody } from "../../utils/parseBody";
import { parseQuery } from "../../utils/parseQuery";
import { paginationSchema } from "../validation";
import { createDataseteSchema, updateDatasetSchema } from "./validation";

export const createDataset = catchAsync(
  async (req) => {
    const body = await parseBody(req, createDataseteSchema);
    return await datasetService.create(body);
  },
  [mapperGoogleSheetError, mapperPrismaError],
);

export const getDatasets = catchAsync(
  async (req) => {
    const { page, limit } = await parseQuery(req, paginationSchema);
    return datasetService.getDataset(page, limit);
  },
  [mapperPrismaError],
);

export const getDatasetById = catchAsync<RouteContext<"/api/dataset/[id]">>(
  async (_, ctx) => {
    const { id } = await ctx.params;
    return datasetService.getDatasetId(id);
  },
  [mapperPrismaError],
);

export const updateDatasetById = catchAsync<RouteContext<"/api/dataset/[id]">>(
  async (req, ctx) => {
    const body = await parseBody(req, updateDatasetSchema);
    const { id } = await ctx.params;
    return datasetService.updateDatasetId(id, body);
  },
  [mapperPrismaError],
);

export const deleteDatasetById = catchAsync<RouteContext<"/api/dataset/[id]">>(
  async (_, ctx) => {
    const { id } = await ctx.params;
    return datasetService.delete(id);
  },
  [mapperPrismaError],
);

export const getPreview = catchAsync<RouteContext<"/api/dataset/preview/[id]">>(
  async (req, ctx) => {
    const { page, limit } = await parseQuery(req, paginationSchema);
    const { id } = await ctx.params;
    return datasetService.getPreview(id, page, limit);
  },
  [mapperPrismaError, mapperGoogleSheetError],
);

export const getAllData = catchAsync<RouteContext<"/api/dataset/all/[id]">>(
  async (_, ctx) => {
    const { id } = await ctx.params;
    return datasetService.getDataAllSnapshot(id);
  },
  [mapperPrismaError, mapperGoogleSheetError],
);

export const refresh = catchAsync<RouteContext<"/api/dataset/refresh/[id]">>(
  async (_, ctx) => {
    const { id } = await ctx.params;
    return datasetService.refresData(id);
  },
  [mapperPrismaError, mapperGoogleSheetError],
);
