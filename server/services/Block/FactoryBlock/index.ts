import { DTOcreateBlock, DTOUpdateBlock } from "../type";
import { createTextBlock, updateTextBlock } from "./TextBlock";
import { createChartBlock, updateChartBlock } from "./ChartBlock";
import { BlockKind } from "../../../../generated/prisma/enums";


export const factoryCreateBlock = (ownerId: string, data: DTOcreateBlock) => {
    switch (data.kind) {
        case 'TEXT': return createTextBlock(ownerId, data)
        case 'CHART': return createChartBlock(ownerId, data)
    }
}

export const factoryUpdateBlock = (ownerId: string, blockId:string, kind: BlockKind, data: DTOUpdateBlock) => {
    switch (kind) {
        case 'TEXT': return updateTextBlock(ownerId, blockId, data)
        case 'CHART': return updateChartBlock(ownerId, blockId, data)
    }
}