import {
  deleteChart,
  getChartId,
  updateChart,
} from "../../../../server/controllers/chart/chart";

export const GET = getChartId;
export const PATCH = updateChart;
export const DELETE = deleteChart;
