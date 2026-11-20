import { z } from 'zod'
import { createDataSourceSchema, updateDataSourceSchema } from './schema'


export type DTOCreateDataSource = z.infer<typeof createDataSourceSchema>
export type DTOUpdateDataSource = z.infer<typeof updateDataSourceSchema>
