export enum TypeConenction {
  PostgreSQL,
  GoogleSheet,
}

export type SetConnection = {
  url:string,
  type:TypeConenction,
  
}