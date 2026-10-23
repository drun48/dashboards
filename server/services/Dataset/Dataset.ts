import { DTOCreateDataset, DTOUpdateDataset } from "./type";
import prisma from "../../db/prisma/prismaClient";
import { getData } from "../../integrations/googleSheets";
import { generateColumnsCsv } from "../../utils/generateColumnsCsv";
import { ApiError } from "../../utils/ApiError";

export class Dataset {
  async create(data: DTOCreateDataset) {
    const dataSource = await prisma.dataSource.findUniqueOrThrow({
      where: { id: data.dataSourceId },
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

  async getDataset(page?: number, limit?: number) {
    return await prisma.dataset.findMany({
      skip: page && limit ? (page - 1) * limit : undefined,
      take: limit,
    });
  }

  async getDatasetId(id: string) {
    return await prisma.dataset.findUnique({
      where: { id },
    });
  }

  async updateDatasetId(id: string, data: DTOUpdateDataset) {
    return await prisma.dataset.update({
      where: { id },
      data,
    });
  }

  async getPreview(id: string, page: number = 1, limit: number = 50) {
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
    WHERE s."datasetId" = ${id}
  `;
    if (!result)
      throw new ApiError({ statusCode: 404, message: "Датасет не найден" });
    return { ...result };
  }

  async getDataAllSnapshot(id: string) {
    const result = await prisma.dataset.findUniqueOrThrow({
      where: { id },
      include: { snapshot: true },
    });
    return result;
  }

  async delete(id: string) {
    return await prisma.dataset.delete({ where: { id } });
  }

  async refresData(id: string) {
    const dataset = await prisma.dataset.findUniqueOrThrow({
      where: { id },
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
