import {
  deleteChartContent,
  updateChartContent,
  getDataChartContent
} from "../../../../server/controllers/chartContent/chartContent";

export const PATCH = updateChartContent;
export const DELETE = deleteChartContent;
export const GET = getDataChartContent;
