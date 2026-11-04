import { z } from 'zod'
import { blockBaseShema, createBlockBaseShema } from '../baseShema'
import { BlockKind } from '../../../../../generated/prisma/client'

export const createBlockSchema = z.strictObject({
    ...createBlockBaseShema.shape,
    kind: z.literal(BlockKind.TEXT),
    text: z.string().min(1)
})

export const updateBlockSchema = z.strictObject({
    ...blockBaseShema.shape,
    text: z.string().min(1)
}).partial()
    .refine((data) => Object.values(data).some((value) => value !== undefined), {
        message: "Хотя бы одно поле должно быть заполнено",
    });