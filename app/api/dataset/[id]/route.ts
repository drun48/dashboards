import { deleteDatasetById, getDatasetById, updateDatasetById } from "../../../../server/controllers/dataset/dataset"

export const GET = getDatasetById
export const PATCH = updateDatasetById
export const DELETE = deleteDatasetById