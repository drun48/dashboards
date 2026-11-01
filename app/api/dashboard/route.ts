import {
  getDashboard,
  createDashboard,
} from "../../../server/controllers/dashboard/dashboard";

export const POST = createDashboard;
export const GET = getDashboard;
