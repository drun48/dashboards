export type DTOCreateDataset = {
  dataSourceId: string;
  name: string;
  columnsIsFirstRow: boolean;
};

export type DTOUpdateDataset = {
  name?:string
}