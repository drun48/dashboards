import { SourceType } from "../../../generated/prisma/enums";

export type DTOCreateDataSource = {
  name: string;
  link: string;
  type: SourceType;
};

export type DTOUpdateDataSource = Partial<Omit<DTOCreateDataSource, "ownerId">>
