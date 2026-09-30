import * as z from "zod";

export const SchemaConnectionCreate = z.object({ 
  type: z.enum(["PostgreSQL", "GoogleSheet"]),
  link: z.string()
});