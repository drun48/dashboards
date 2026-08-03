import { DragMoveEvent } from "@dnd-kit/react";
import { ParamsDnDGrid, CoreDndElement, ResizeDirection } from "./type";
import { fromGlobalToNormalCoords, normalizePosition } from "./calc";
import { getAllCollisions, isAllCollision } from "./collisions";
import { compactor } from "./compactor";
import { DnDElement } from "./element";

export const transformElementsToClass = (
  elements: CoreDndElement[],
  params: ParamsDnDGrid,
) => {
  return elements.map((el) => new DnDElement({ ...el, gap: params.gap }));
};
export const transformElementsFromClass = (elements: DnDElement[]) => {
  return elements.map((el) => ({ ...el }));
};

export const moveElement = (e: DragMoveEvent, params: ParamsDnDGrid) => {
  const elementsCopy = transformElementsToClass(
    structuredClone(params.elements),
    params,
  );
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
  const elementsCopy = transformElementsToClass(
    structuredClone(params.elements),
    params,
  );
  const element = elementsCopy.find(
    (el) => el.id === (e.operation.source?.id as string).split("_")[1],
  );
  const initElement = params.initElements.find(
    (el) => el.id === (e.operation.source?.id as string).split("_")[1],
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

const getUnderElements = (
  targetElement: DnDElement,
  allElements: DnDElement[],
) => {
  const zone = {
    left: targetElement.getLeft(),
    right: targetElement.getRight(),
  };
  const underElement: DnDElement[] = [];
  for (const el of allElements) {
    if (
      targetElement.getBottom() > el.getTop() ||
      el.getLeft() > zone.right ||
      el.getRight() < zone.left
    )
      continue;
    underElement.push(el);
    zone.left = Math.min(el.getLeft(), zone.left);
    zone.right = Math.max(el.getRight(), zone.right);
  }
  return underElement;
};

export const resolveCollisions = (
  elementMoving: DnDElement,
  params: ParamsDnDGrid,
) => {
  const allcollision = getAllCollisions(elementMoving, params.elements);
  if (!allcollision.length) return;
  const calculateOffsetY = new Map<DnDElement, number>();
  for (const collision of allcollision) {
    const underElements = getUnderElements(collision, params.elements);
    let targetY = elementMoving.h + elementMoving.y;
    calculateOffsetY.set(
      collision,
      Math.max(calculateOffsetY.get(collision) ?? targetY, targetY),
    );
    targetY = calculateOffsetY.get(collision)! + collision.h;
    for (const underElement of underElements) {
      calculateOffsetY.set(
        underElement,
        Math.max(calculateOffsetY.get(underElement) ?? targetY, targetY),
      );
      targetY = calculateOffsetY.get(underElement)! + underElement.h;
    }
  }
  for (const [element, yOffset] of calculateOffsetY.entries()) {
    element.y = yOffset;
  }
};

export const createElement = (data: Omit<CoreDndElement, "id">) => {
  return { ...data, id: crypto.randomUUID() };
};

export const createDndElement = (
  { w, h }: Pick<CoreDndElement, "w" | "h">,
  params: ParamsDnDGrid,
) => {
  const elementsCopy = transformElementsToClass(
    structuredClone(params.elements),
    params,
  );
  elementsCopy.sort((a, b) => a.y - b.y);
  for (const el of elementsCopy) {
    const positionsVariants = [
      normalizePosition({ x: el.x - w - params.gap, y: el.y }, params),
      normalizePosition({ x: el.x + el.w + params.gap, y: el.y }, params),
      normalizePosition({ x: el.x, y: el.y + el.h + params.gap }, params),
    ]; 
    for (const position of positionsVariants) {
      const variant = new DnDElement({
        ...createElement({ w, h, ...position }),
        gap: params.gap,
      });
      if (
        isAllCollision(
          new DnDElement({ ...variant, gap: params.gap }),
          elementsCopy,
        )
      )
        continue;
      return variant;
    }
  }

  return createElement({ w, h, x: 0, y: 0 });
};
