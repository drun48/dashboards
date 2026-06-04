import { DragMoveEvent } from "@dnd-kit/react";
import { MoveItem, Point } from "./type";
import { getNewPosition, normalizePosition } from "./confirnes";
import { getAllCollisions, isCollision } from "./collisions";
import { compactor } from "./compactor";

export const startMove = (
  e: DragMoveEvent,
  elements: MoveItem[],
  step: number,
  max: Point,
  min: Point,
) => {
  const elementsCopy = structuredClone(elements);
  elementsCopy.sort((a, b) => a.y - b.y);
  const findIndex = elementsCopy.findIndex(
    (el) => el.id === e.operation.source?.id,
  );
  if (findIndex === -1) return elementsCopy;
  const previous = {
    x: elementsCopy[findIndex].x * step,
    y: elementsCopy[findIndex].y * step,
  };
  const offset = getOffset(previous, e.operation.position.current);
  const yDuration = directionDurationY(e.operation.position.velocity);
  const isMove = move(
    elementsCopy[findIndex],
    getNewPosition(elementsCopy[findIndex], offset, step, max, min),
    elementsCopy,
    yDuration,
    step,
    max,
    min,
  );
  if (!isMove) return elements;
  return compactor([...elementsCopy]);
};

const directionDurationY = (offset: Point) => {
  return Math.sign(offset.y) || -1;
};

const getOffset = (prev: Point, current: Point) => {
  const offsetX = Math.round(current.x - prev.x);
  const offsetY = Math.round(current.y - prev.y);
  return { x: offsetX, y: offsetY };
};

export const move = (
  element: MoveItem,
  poisition: Point,
  elements: MoveItem[],
  yDuration: number,
  step: number,
  max: Point,
  min: Point,
): boolean => {
  let isMove = true;
  element.x = poisition.x;
  element.y = poisition.y;
  const allcollision = getAllCollisions(element, elements);
  if (allcollision.length === 0) return true;
  for (const collision of allcollision) {
    if (!isCollision(element, collision)) continue;
    if (collision.y < element.y && yDuration < 0) return false;
    let newY = element.y + element.h;
    if (yDuration > 0) {
      newY = element.y - collision.h;
    }
    isMove &&= move(
      collision,
      normalizePosition({ x: collision.x, y: newY }, max, min),
      elements,
      -1,
      step,
      max,
      min,
    );
    if (!isMove) return isMove;
  }
  return isMove;
};
