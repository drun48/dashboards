import { DTOCreateDataset, DTOUpdateDataset } from "./type";
import prisma from "../../db/prisma/prismaClient";
import { getData } from "../../integrations/googleSheets";
import { generateColumnsCsv } from "../../utils/generateColumnsCsv";
import { ApiError } from "../../utils/ApiError";

export class Dataset {
  async create(ownerId: string, data: DTOCreateDataset) {
    const dataSource = await prisma.dataSource.findUniqueOrThrow({
      where: { id: data.dataSourceId, ownerId },
    });
    const dataCsv = await getData(dataSource.link);
    const columns: string[] = [];
    for (let i = 0; i < dataCsv.rows?.[0].length; ++i) {
      if (data.columnsIsFirstRow && dataCsv.rows[0][i])
        columns.push(dataCsv.rows[0][i]);
      else columns.push(generateColumnsCsv(i));
    }
    const result = await prisma.$transaction(async (tx) => {
      const { name, columnsIsFirstRow } = data;
      const dataset = await tx.dataset.create({
        data: {
          name,
          columnsIsFirstRow,
          source: { connect: { id: dataSource.id } },
        },
      });

      await tx.datasetSnapshot.create({
        data: {
          columns,
          rows: dataCsv.rows,
          rowCount: dataCsv.rowCount,
          dataset: { connect: { id: dataset.id } },
        },
      });
      return dataset;
    });
    return result;
  }

  async getDataset(ownerId: string, page?: number, limit?: number) {
    return await prisma.dataset.findMany({
      where: { source: { ownerId } },
      skip: page && limit ? (page - 1) * limit : undefined,
      take: limit,
    });
  }

  async getDatasetId(ownerId: string, id: string) {
    return await prisma.dataset.findUnique({
      where: { id, source: { ownerId } },
    });
  }

  async updateDatasetId(ownerId: string, id: string, data: DTOUpdateDataset) {
    return await prisma.dataset.update({
      where: { id, source: { ownerId } },
      data,
    });
  }

  async getPreview(ownerId: string, id: string, page: number = 1, limit: number = 50) {
    const offset = (page - 1) * limit;
    const [result] = await prisma.$queryRaw<
      { columns: string[]; rows: unknown[][]; rowCount: number }[]
    >`
    SELECT s."columns", s."rowCount",
      COALESCE((
        SELECT jsonb_agg(elem ORDER BY idx)
        FROM jsonb_array_elements(s."rows") WITH ORDINALITY AS t(elem, idx)
        WHERE idx > ${offset} AND idx <= ${offset + limit}
      ), '[]'::jsonb) AS "rows"
    FROM "DatasetSnapshot" s
    JOIN "Dataset" d ON d."id" = s."datasetId"
    JOIN "DataSource" ds ON ds."id" = d."sourceId"
    WHERE s."datasetId" = ${id} AND ds."ownerId" = ${ownerId}
  `;
    if (!result)
      throw new ApiError({ statusCode: 404, message: "Датасет не найден" });
    return { ...result };
  }

  async getDataAllSnapshot(ownerId: string, id: string) {
    const result = await prisma.dataset.findUniqueOrThrow({
      where: { id, source: { ownerId } },
      include: { snapshot: true },
    });
    return result;
  }

  async delete(ownerId: string, id: string) {
    return await prisma.dataset.delete({ where: { id, source: { ownerId } } });
  }

  async refresData(ownerId: string, id: string) {
    const dataset = await prisma.dataset.findUniqueOrThrow({
      where: { id, source: { ownerId } },
      include: { source: true },
    });
    const dataCsv = await getData(dataset.source.link);
    const columns: string[] = [];
    for (let i = 0; i < dataCsv.rows?.[0].length; ++i) {
      if (dataset.columnsIsFirstRow && dataCsv.rows[0][i])
        columns.push(dataCsv.rows[0][i]);
      else columns.push(generateColumnsCsv(i));
    }
    if (dataset.columnsIsFirstRow) {
    }
    prisma.datasetSnapshot.update({
      where: { datasetId: dataset.id },
      data: {
        columns,
        rows: dataset.columnsIsFirstRow ? dataCsv.rows.slice(1) : dataCsv.rows,
        rowCount: dataCsv.rowCount,
      },
    });
  }
}

export const datasetService = new Dataset();
