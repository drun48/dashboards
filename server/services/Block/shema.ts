import { z } from 'zod'
import { createBlockSchema as createTextBlockSchema, updateBlockSchema as updateTextBlockSchema } from "./FactoryBlock/TextBlock/schema";
import { createBlockSchema as createChartBlockSchema, updateBlockSchema as updateChartBlockSchema } from "./FactoryBlock/ChartBlock/schema";

export const createBlockSchema = z.discriminatedUnion("kind", [
    createChartBlockSchema,
    createTextBlockSchema,
]);

export const updateBlockSchema = z.union([
    updateChartBlockSchema,
    updateTextBlockSchema,
]);