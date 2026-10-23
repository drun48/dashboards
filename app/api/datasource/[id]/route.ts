import { getDataSourceById, deleteDataSourceById, updateDataSourceById } from "../../../../server/controllers/dataSource/dataSource";

export const GET = getDataSourceById;
export const DELETE = deleteDataSourceById
export const PATCH = updateDataSourceById
