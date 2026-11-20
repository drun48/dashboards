import { DatasetSnapshot } from "../../../generated/prisma/client";
import { z } from 'zod'
import { createDataseteSchema, updateDatasetSchema } from "./schema";

export type DTOCreateDataset = z.infer<typeof createDataseteSchema>
export type DTOUpdateDataset = z.infer<typeof updateDatasetSchema>


export type RowData = string | number | null
export type DTODatasetSnapshot = Omit<DatasetSnapshot, 'columns' | 'rows'> & { columns: Array<string>, rows: Array<Array<RowData>> } | null