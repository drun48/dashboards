import { DragMoveEvent } from "@dnd-kit/react";
import { ParamsDnDGrid, DnDElement, ResizeDirection } from "./type";
import { fromGlobalToNormalCoords, normalizePosition } from "./calc";
import { getAllCollisions, isCollision } from "./collisions";
import { compactor } from "./compactor";

export const moveElement = (e: DragMoveEvent, params: ParamsDnDGrid) => {
  const elementsCopy = structuredClone(params.elements);
  const element = elementsCopy.find((el) => el.id === e.operation.source?.id);
  const initElement = params.initElements.find(
    (el) => el.id === e.operation.source?.id,
  );
  if (!element || !initElement) return elementsCopy;
  const { x: offsetX, y: offsetY } = fromGlobalToNormalCoords(
    e.operation.transform,
    params,
  );
  const { x, y } = normalizePosition(
    { x: initElement.x + offsetX, y: initElement.y + offsetY },
    params,
  );
  element.x = x;
  element.y = y;
  elementsCopy.sort((a, b) => a.y - b.y);
  resolveCollisions(element, {
    ...params,
    elements: elementsCopy,
  });
  return compactor([...elementsCopy]);
};

export const resizeElement = (
  e: DragMoveEvent,
  direction: ResizeDirection,
  params: ParamsDnDGrid,
) => {
  const elementsCopy = structuredClone(params.elements);
  const element = elementsCopy.find(
    (el) => el.id === (e.operation.source?.id as string).split("-")[1],
  );
  const initElement = params.initElements.find(
    (el) => el.id === (e.operation.source?.id as string).split("-")[1],
  );
  if (!element || !initElement) return elementsCopy;
  const { x: offsetX, y: offsetY } = fromGlobalToNormalCoords(
    e.operation.transform,
    params,
  );
  switch (direction) {
    case "rb": {
      element.w = initElement.w + offsetX;
      element.h = initElement.h + offsetY;
      break;
    }
    case "lb": {
      element.x = Math.min(
        initElement.x + offsetX,
        initElement.x + initElement.w,
      );
      element.w = initElement.w + initElement.x - element.x;
      element.h = initElement.h + offsetY;
      break;
    }
  }
  elementsCopy.sort((a, b) => a.y - b.y);
  resolveCollisions(element, {
    ...params,
    elements: elementsCopy,
  });
  return compactor([...elementsCopy]);
};

export const resolveCollisions = (
  elementMoving: DnDElement,
  params: ParamsDnDGrid,
) => {
  const stack: Array<DnDElement> = [elementMoving];
  while (stack.length) {
    const element = stack.shift()!;

    const allcollision = getAllCollisions(element, params.elements);
    if (allcollision.length === 0) continue;

    for (const collision of allcollision) {
      if (!isCollision(element, collision)) continue;
      const { y } = normalizePosition(
        { x: collision.x, y: element.y + element.h },
        params,
      );
      collision.y = y;
      stack.push(collision);
    }
  }
};
