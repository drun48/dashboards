import { dashboardService } from "../../services/Dashboard/Dashboard";
import { catchAsync } from "../../utils/catchAync";
import { mapperPrismaError } from "../../utils/errors/mapperPrismaError";
import { getSessionOrThrow } from "../../utils/getSessionOrThrow";
import { parseBody } from "../../utils/parseBody";
import { parseQuery } from "../../utils/parseQuery";
import { paginationSchema } from "../validation";
import { createDashboardSchema, updateDashboardSchema } from "./validations";

type DashboardContext = { params: Promise<{ id: string }> };

export const createDashboard = catchAsync(
  async (req) => {
    const body = await parseBody(req, createDashboardSchema);
    const { idUser } = await getSessionOrThrow()
    return await dashboardService.create(idUser, body);
  },
  [mapperPrismaError],
);

export const getDashboard = catchAsync(
  async (req) => {
    const { page, limit } = await parseQuery(req, paginationSchema);
    const { idUser } = await getSessionOrThrow()
    return dashboardService.getDashboards(idUser, page, limit);
  },
  [mapperPrismaError],
);

export const getDashboardId = catchAsync<DashboardContext>(
  async (_, ctx) => {
    const { id } = await ctx.params;
    const { idUser } = await getSessionOrThrow()
    return dashboardService.getDashboardId(idUser, id);
  },
  [mapperPrismaError],
);

export const updateDashboard = catchAsync<DashboardContext>(
  async (req, ctx) => {
    const body = await parseBody(req, updateDashboardSchema);
    const { id } = await ctx.params;
    const { idUser } = await getSessionOrThrow()
    return dashboardService.updateDashboard(idUser, id, body);
  },
  [mapperPrismaError],
);

export const deleteDashboard = catchAsync<DashboardContext>(
  async (_, ctx) => {
    const { id } = await ctx.params;
    const { idUser } = await getSessionOrThrow()
    return dashboardService.deleteDashboard(idUser, id);
  },
  [mapperPrismaError],
);
