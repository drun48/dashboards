import { parse } from "csv-parse/sync";
import { GoogleSheetError } from "../utils/errors/mapperGoogleSheetError";

export async function getData(url: string) {
  const { gid, spreadsheetId } = parseGoogleSheetsUrl(url);

  const exportUrl = new URL(
    `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export`,
  );

  exportUrl.searchParams.set("format", "csv");
  exportUrl.searchParams.set("gid", gid);

  const response = await fetch(exportUrl, {
    signal: AbortSignal.timeout(15000),
    redirect: "follow",
  });

  if (!response.ok) {
    throw new GoogleSheetError({ statusCode: response.status, message: "" });
  }

  const csv = await response.text();
  const rows: string[][] = parse(csv, {
    bom: true,
    skip_empty_lines: false,
    relax_column_count: true,
  });

  return {
    rows,
    rowCount: rows.length,
  };
}

export async function getDataPreview(url: string, limit: number = 50) {
  const { gid, spreadsheetId } = parseGoogleSheetsUrl(url);

  const exportUrl = new URL(
    `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq`,
  );

  exportUrl.searchParams.set("tqx", "out:csv");
  exportUrl.searchParams.set("gid", gid);
  exportUrl.searchParams.set("tq", `select * limit ${limit}`);

  const response = await fetch(exportUrl, {
    signal: AbortSignal.timeout(15000),
    redirect: "follow",
  });

  if (!response.ok) {
    throw new GoogleSheetError({ statusCode: response.status, message: "" });
  }

  const csv = await response.text();
  const rows: string[][] = parse(csv, {
    bom: true,
    skip_empty_lines: false,
    relax_column_count: true,
  });

  return {
    rows,
    rowCount: rows.length,
  };
}

export async function check(url: string) {
  await getDataPreview(url, 1);
  return true;
}

interface GoogleSheetsUrl {
  spreadsheetId: string;
  gid: string;
}

function parseGoogleSheetsUrl(input: string): GoogleSheetsUrl {
  let url: URL;

  try {
    url = new URL(input);
  } catch {
    throw new Error("Некорректный URL");
  }

  if (
    url.protocol !== "https:" ||
    url.hostname !== "docs.google.com" ||
    url.port !== "" ||
    url.username !== "" ||
    url.password !== ""
  ) {
    throw new Error("Недопустимый домен или протокол");
  }

  const match = url.pathname.match(
    /^\/spreadsheets\/d\/([a-zA-Z0-9_-]+)\/(edit|view|htmlview)\/?$/,
  );

  if (!match) {
    throw new Error("Это не ссылка на Google Sheets");
  }

  const spreadsheetId = match[1];

  const hashParams = new URLSearchParams(
    url.hash.replace(/^#/, "").replace(/^\?/, ""),
  );

  const gid = url.searchParams.get("gid") ?? hashParams.get("gid") ?? "0";

  if (!/^\d+$/.test(gid)) {
    throw new Error("Некорректный gid листа");
  }

  return { spreadsheetId, gid };
}
