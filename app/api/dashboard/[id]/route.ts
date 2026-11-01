import {getDashboardId, updateDashboard, deleteDashboard} from '../../../../server/controllers/dashboard/dashboard'

export const GET = getDashboardId
export const PATCH = updateDashboard
export const DELETE = deleteDashboard