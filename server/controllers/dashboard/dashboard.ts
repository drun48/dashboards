import { dashboardService } from "../../services/Dashboard/Dashboard";
import { catchAsync } from "../../utils/catchAync";
import { mapperPrismaError } from "../../utils/errors/mapperPrismaError";
import { parseBody } from "../../utils/parseBody";
import { parseQuery } from "../../utils/parseQuery";
import { paginationSchema } from "../validation";
import { createDashboardSchema, updateDashboardSchema } from "./validations";

type DashboardContext = { params: Promise<{ id: string }> };

export const createDashboard = catchAsync(
  async (req) => {
    const body = await parseBody(req, createDashboardSchema);
    return await dashboardService.create("1", body);
  },
  [mapperPrismaError],
);

export const getDashboard = catchAsync(
  async (req) => {
    const { page, limit } = await parseQuery(req, paginationSchema);
    return dashboardService.getDashboards("1", page, limit);
  },
  [mapperPrismaError],
);

export const getDashboardId = catchAsync<DashboardContext>(
  async (_, ctx) => {
    const { id } = await ctx.params;
    return dashboardService.getDashboardId("1", id);
  },
  [mapperPrismaError],
);

export const updateDashboard = catchAsync<DashboardContext>(
  async (req, ctx) => {
    const body = await parseBody(req, updateDashboardSchema);
    const { id } = await ctx.params;
    return dashboardService.updateDashboard("1", id, body);
  },
  [mapperPrismaError],
);

export const deleteDashboard = catchAsync<DashboardContext>(
  async (_, ctx) => {
    const { id } = await ctx.params;
    return dashboardService.deleteDashboard("1", id);
  },
  [mapperPrismaError],
);
