import { DnDElement } from "./element";

export const compactor = (elements: DnDElement[]) => {
  elements.sort((a, b) => a.y - b.y || a.x - b.x);

  const processed = [];

  for (const current of elements) {
    let highestCeiling = 0;

    for (const upper of processed) {
      const isOverlappingX =
        current.getLeft() < upper.getRight() &&
        current.getRight() > upper.getLeft();

      if (isOverlappingX) {
        highestCeiling = Math.max(
          upper.getBottom() + (upper.gap ?? 0) / 2,
          highestCeiling,
        );
      }
    }

    current.y = highestCeiling;

    processed.push(current);
  }

  return elements;
};
