import { DragMoveEvent } from "@dnd-kit/react";
import { ParamsDnDGrid, DnDElement, ResizeDirection } from "./type";
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
  const { x, y } = normalizePosition(
    fromGlobalToNormalCoords(
      { x: e.operation.shape?.current.left, y: e.operation.shape?.current.top },
      params,
    ),
    params,
  );
  element.x = x;
  element.y = y;
  elementsCopy.sort((a, b) => a.y - b.y);
  resolveCollisions(element, {
    ...params,
    elements: elementsCopy,
  });
  // return elementsCopy;
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
  const { x, y } = fromGlobalToNormalCoords(
    {
      x: e.operation.shape?.current.boundingRectangle.left ?? 0,
      y: e.operation.shape?.current.boundingRectangle.top ?? 0,
    },
    params,
  );
  // console.log(e);
  const element = elementsCopy[findIndex];
  const { x: prevX, y: prevY } = fromGlobalToNormalCoords(
    {
      x:
        e.operation.shape?.previous?.boundingRectangle.left ??
        e.operation.shape?.initial?.boundingRectangle.left ??
        0,
      y:
        e.operation.shape?.previous?.boundingRectangle.top ??
        e.operation.shape?.initial?.boundingRectangle.top ??
        0,
    },
    params,
  );
  switch (direction) {
    case "rb": {
      element.w += x - prevX;
      element.h += y - prevY;
      break;
    }
    case "lb": {
      element.x += x - prevX;
      element.w -= x - prevX;
      element.h += y - prevY;
      break;
    }
  }
  elementsCopy.sort((a, b) => a.y - b.y);
  resolveCollisions(elementsCopy[findIndex], {
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
