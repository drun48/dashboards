import { DragMoveEvent } from "@dnd-kit/react";
import { MoveItem, Point } from "./type";
import { getNewPosition, normalizePosition } from "./confirnes";
import { getAllCollisions } from "./collisions";
import { compactor } from "./compactor";

export const startMove = (
  e: DragMoveEvent,
  elements: MoveItem[],
  step: number,
  max: Point,
  min: Point,
) => {
  const elementsCopy = structuredClone(elements);
  const findIndex = elementsCopy.findIndex(
    (el) => el.id === e.operation.source?.id,
  );
  if (findIndex === -1) return elementsCopy;
  const offset = getOffset(
    elementsCopy[findIndex],
    e.operation.position.current,
    step,
  );
  // const yDuration = directionDurationY(offset);
  move(
    elementsCopy[findIndex],
    getNewPosition(elementsCopy[findIndex], offset, step, max, min),
    elementsCopy,
    step,
    max,
    min,
  );
  return compactor([...elementsCopy]);
};

const directionDurationY = (offset: Point) => {
  return Math.sign(offset.y) || -1;
};

const getOffset = (element: MoveItem, current: Point, step: number) => {
  const offsetX = Math.round(current.x - element.x * step);
  const offsetY = Math.round(current.y - element.y * step);
  return { x: offsetX, y: offsetY };
};

export const move = (
  element: MoveItem,
  poisition: Point,
  elements: MoveItem[],
  step: number,
  max: Point,
  min: Point,
) => {
  element.x = poisition.x;
  element.y = poisition.y;
  elements.sort((a, b) => a.y - b.y);
  const allcollision = getAllCollisions(element, elements);
  if (allcollision.length === 0) return;

  allcollision.forEach((collision) => {
    const newY = element.y + element.h;
    // if (yDuration > 0) {
    //   newY = element.y - collision.h;
    // }
    move(
      collision,
      normalizePosition({ x: collision.x, y: newY }, max, min),
      elements,
      step,
      max,
      min,
    );
  });
};
