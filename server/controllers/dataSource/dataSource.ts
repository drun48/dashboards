import { dataSourceService } from "../../services/DataSource/DataSource";
import { catchAsync } from "../../utils/catchAync";
import { mapperGoogleSheetError } from "../../utils/errors/mapperGoogleSheetError";
import { mapperPrismaError } from "../../utils/errors/mapperPrismaError";
import { parseBody } from "../../utils/parseBody";
import { parseQuery } from "../../utils/parseQuery";
import { paginationSchema } from "../validation";
import { createDataSourceSchema, updateDataSourceSchema } from "./validation";

export const setDataSourceController = catchAsync(
  async (req) => {
    const body = await parseBody(req, createDataSourceSchema);
    return await dataSourceService.setDataSource("1", body);
  },
  [mapperGoogleSheetError, mapperPrismaError],
);

export const getDataSource = catchAsync(
  async (req) => {
    const { page, limit } = await parseQuery(req, paginationSchema);
    return await dataSourceService.getDataSource("1", page, limit);
  },
  [mapperPrismaError],
);

export const getDataSourceById = catchAsync<
  RouteContext<"/api/datasource/[id]">
>(
  async (_, ctx) => {
    const { id } = await ctx.params;
    return dataSourceService.getDataSourceById(id);
  },
  [mapperPrismaError],
);

export const deleteDataSourceById = catchAsync<
  RouteContext<"/api/datasource/[id]">
>(
  async (_, ctx) => {
    const { id } = await ctx.params;
    return dataSourceService.deleteDataSourceById(id);
  },
  [mapperPrismaError],
);

export const updateDataSourceById = catchAsync<
  RouteContext<"/api/datasource/[id]">
>(
  async (req, ctx) => {
    const body = await parseBody(req, updateDataSourceSchema);
    const { id } = await ctx.params;
    return dataSourceService.updateDataSourceById(id, body);
  },
  [mapperPrismaError],
);
