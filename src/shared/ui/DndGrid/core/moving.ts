import { DragMoveEvent } from "@dnd-kit/react";
import { ParamsDnDGrind, Point, DnDElement } from "./type";
import { fromGlobalToNormalPosition, normalizePosition } from "./calc";
import { getAllCollisions, isCollision } from "./collisions";
import { compactor } from "./compactor";

export const moveElement = (e: DragMoveEvent, params: ParamsDnDGrind) => {
  const elementsCopy = structuredClone(params.elements);
  elementsCopy.sort((a, b) => a.y - b.y);
  const findIndex = elementsCopy.findIndex(
    (el) => el.id === e.operation.source?.id,
  );
  if (findIndex === -1) return elementsCopy;
  console.log(e.operation.position.current)
  const isMove = resolveCollisions(
    elementsCopy[findIndex],
    normalizePosition(
      fromGlobalToNormalPosition(e.operation.position.current, params),
      params,
    ),
    { ...params, elements: elementsCopy },
  );
  if (!isMove) return params.elements;
  return compactor([...elementsCopy]);
};

export const resolveCollisions = (
  element: DnDElement,
  poisition: Point,
  params: ParamsDnDGrind,
): boolean => {
  const stack: Array<[DnDElement, Point]> = [[element, poisition]];
  const setResolveCollisionsElements = new Set<DnDElement>([element]);

  while (stack.length) {
    const [element, poisition] = stack.pop()!;
    element.x = poisition.x;
    element.y = poisition.y;

    const allcollision = getAllCollisions(element, params.elements);
    if (allcollision.length === 0) continue;

    for (const collision of allcollision) {
      if (setResolveCollisionsElements.has(collision)) return false;
      if (!isCollision(element, collision)) continue;
      stack.push([
        collision,
        normalizePosition({ x: collision.x, y: element.y + element.h }, params),
      ]);
      setResolveCollisionsElements.add(collision);
    }
  }
  return true;
};
