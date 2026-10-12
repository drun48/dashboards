import { dataSourceService } from "../../services/DataSource/DataSource";
// import { catchAsync } from "../../utils/cathAsync";
import { catchAsync } from "../../utils/catchAync";
import { parseBody } from "../../utils/parseBody";
import { parseQuery } from "../../utils/parseQuery";
import { paginationSchema } from "../validation";
import { createDataSourceSchema } from "./validation";

export const setDataSourceController = catchAsync(async (req) => {
  const body = await parseBody(req, createDataSourceSchema);
  return await dataSourceService.setDataSource("1", body);
});

export const getDataSource = catchAsync(async (req) => {
  const { page, limit } = await parseQuery(req, paginationSchema);
  console.log("page, limit", page, limit);
  return await dataSourceService.getDataSource("1", page, limit);
});

export const getDataSourceById = catchAsync<
  RouteContext<"/api/datasource/[id]">
>(async (_, ctx) => {
  const { id } = await ctx.params;
  return dataSourceService.getDataSourceById(id);
});

// export async function getDataSource(): Promise<any> {}

// export async function getDataSourceById(id: string): Promise<any> {}

// export async function deleteDataSourceById(id: string): Promise<any> {}

// export async function updateDataSourceById(
//   id: string,
//   data: DTOUpdateDataSource,
// ): Promise<any> {}
