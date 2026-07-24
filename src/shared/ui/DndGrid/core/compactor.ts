import { CoreDndElement } from "./type";

export const compactor = (elements: CoreDndElement[]) => {
  elements.sort((a, b) => a.y - b.y || a.x - b.x);

  const processed = [];

  for (const current of elements) {
    let highestCeiling = 0;

    for (const upper of processed) {
      const isOverlappingX =
        current.x < upper.x + upper.w && current.x + current.w > upper.x;

      if (isOverlappingX) {
        highestCeiling = Math.max(upper.y + upper.h, highestCeiling);
      }
    }

    current.y = highestCeiling;

    processed.push(current);
  }

  return elements;
};
