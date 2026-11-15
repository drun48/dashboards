import { DTOCreateDataset, DTODatasetSnapshot, DTOUpdateDataset, RowData } from "./type";
import prisma from "../../db/prisma/prismaClient";
import { getData } from "../../integrations/googleSheets";
import { ApiError } from "../../utils/ApiError";

export class Dataset {
  async create(ownerId: string, data: DTOCreateDataset) {
    const dataSource = await prisma.dataSource.findUniqueOrThrow({
      where: { id: data.dataSourceId, ownerId },
    });
    const { name, columnsIsFirstRow } = data;
    const { columns, rows, rowCount } = await getData(dataSource.link, columnsIsFirstRow);
    const result = await prisma.$transaction(async (tx) => {
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
          rows,
          rowCount,
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

  async getDataAllSnapshot(ownerId: string, id: string, selectColumn: Array<string> = []) {
    const res = await prisma.dataset.findUniqueOrThrow({
      where: { id, source: { ownerId } },
      include: { snapshot: true },
    });
    const snapshot = res.snapshot as DTODatasetSnapshot
    if (!selectColumn.length || !snapshot) {
      return { ...res, snapshot };
    }
    const mapColumnPosition = snapshot.columns.reduce((res, el, i) => {
      if (res.has(el)) res.set(el, i)
      return res
    }, new Map<string, number | null>(
      selectColumn.map((el) => [el, null])
    ))
    const rows = snapshot.rows.map((row) => {
      const newRow: Array<RowData> = []
      selectColumn.forEach((col) => {
        if (mapColumnPosition.get(col) === null) {
          newRow.push(null)
          return
        }
        newRow.push(row[mapColumnPosition.get(col) as number] ?? null)
      })
      return newRow
    })
    return {
      ...res, snapshot: {
        ...snapshot,
        rows,
        columns: selectColumn
      }
    };
  }

  async delete(ownerId: string, id: string) {
    return await prisma.dataset.delete({ where: { id, source: { ownerId } } });
  }

  async refresData(ownerId: string, id: string) {
    const dataset = await prisma.dataset.findUniqueOrThrow({
      where: { id, source: { ownerId } },
      include: { source: true },
    });
    const { columns, rows, rowCount } = await getData(dataset.source.link, dataset.columnsIsFirstRow);
    return await prisma.datasetSnapshot.update({
      where: { datasetId: dataset.id },
      data: {
        columns,
        rows,
        rowCount,
      },
    });
  }
}

export const datasetService = new Dataset();
