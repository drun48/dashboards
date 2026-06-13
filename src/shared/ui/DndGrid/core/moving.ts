import { DragMoveEvent } from "@dnd-kit/react";
import { ParamsDnDGrid, DnDElement, VectorSize, ResizeDirection } from "./type";
import { fromGlobalToNormalCoords, normalizePosition } from "./calc";
import { getAllCollisions, isCollision } from "./collisions";
import { compactor } from "./compactor";

export const moveElement = (e: DragMoveEvent, params: ParamsDnDGrid) => {
  const elementsCopy = structuredClone(params.elements);
  const findIndex = elementsCopy.findIndex(
    (el) => el.id === e.operation.source?.id,
  );
  if (findIndex === -1) return elementsCopy;
  const element = elementsCopy[findIndex];
  elementsCopy.sort((a, b) => a.y - b.y);
  const { x, y } = normalizePosition(
    fromGlobalToNormalCoords(
      { x: e.operation.shape?.current.left, y: e.operation.shape?.current.top },
      params,
    ),
    params,
  );
  element.x = x;
  element.y = y;
  const isResolve = resolveCollisions(element, {
    ...params,
    elements: elementsCopy,
  });
  if (!isResolve) return params.elements;
  return compactor([...elementsCopy]);
};

export const resizeElement = (
  e: DragMoveEvent,
  direction: ResizeDirection,
  params: ParamsDnDGrid,
) => {
  const elementsCopy = structuredClone(params.elements);
  const findIndex = elementsCopy.findIndex(
    (el) => el.id === e.operation.source?.id.split("-")[1],
  );
  if (findIndex === -1) return elementsCopy;
  const { x, y } = normalizePosition(
    fromGlobalToNormalCoords(e.operation.transform, params),
    params,
  );
  const element = elementsCopy[findIndex];
  switch (direction) {
    case "lt": {
      element.w = element.w + element.x - x;
      element.h = element.h + element.y - y;

      element.x = x;
      element.y = y;
      break;
    }
    case "rt": {
      element.w = x - element.x;
      element.h = element.h + element.y - y;

      element.y = y;
      break;
    }
    case "rb":
    case "lb": {
      element.w = x - element.w;
      element.h = y - element.h;
      break;
    }
  }
  elementsCopy.sort((a, b) => a.y - b.y);
  const isResolve = resolveCollisions(elementsCopy[findIndex], {
    ...params,
    elements: elementsCopy,
  });
  if (!isResolve) return params.elements;
  return compactor([...elementsCopy]);
};

export const resolveCollisions = (
  element: DnDElement,
  params: ParamsDnDGrid,
): boolean => {
  const stack: Array<DnDElement> = [element];
  const setResolveCollisionsElements = new Set<DnDElement>([element]);

  while (stack.length) {
    const element = stack.pop()!;

    const allcollision = getAllCollisions(element, params.elements);
    if (allcollision.length === 0) continue;

    for (const collision of allcollision) {
      if (setResolveCollisionsElements.has(collision)) return false;
      if (!isCollision(element, collision)) continue;
      const { y } = normalizePosition(
        { x: collision.x, y: element.y + element.h },
        params,
      );
      collision.y = y;
      stack.push(collision);
      setResolveCollisionsElements.add(collision);
    }
  }
  return true;
};
