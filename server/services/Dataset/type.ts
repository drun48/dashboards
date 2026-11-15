import { DatasetSnapshot } from "../../../generated/prisma/client";

export type DTOCreateDataset = {
  dataSourceId: string;
  name: string;
  columnsIsFirstRow: boolean;
};

export type DTOUpdateDataset = {
  name?: string
}


export type RowData = string | number | null
export type DTODatasetSnapshot = Omit<DatasetSnapshot, 'columns' | 'rows'> & { columns: Array<string>, rows: Array<Array<RowData>> } | null