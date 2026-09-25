import { DnDElement } from "./element";

export const isCollision = (elements1: DnDElement, elements2: DnDElement) => {
  const isCollisionX =
    (elements1.getLeft() <= elements2.getLeft() &&
      elements2.getLeft() < elements1.getRight()) ||
    (elements2.getLeft() <= elements1.getLeft() &&
      elements1.getLeft() < elements2.getRight());

  const isCollisionY =
    (elements1.getTop() <= elements2.getTop() &&
      elements2.getTop() < elements1.getBottom()) ||
    (elements2.getTop() <= elements1.getTop() &&
      elements1.getTop() < elements2.getBottom());

  return isCollisionX && isCollisionY;
};

export const getAllCollisions = (
  element: DnDElement,
  elements: DnDElement[],
) => {
  return elements.filter((candidate) => {
    if (candidate.id === element.id) return false;
    return isCollision(element, candidate);
  });
};

export const isAllCollision = (element: DnDElement, elements: DnDElement[]) => {
  for (const candidate of elements) {
    if (isCollision(element, candidate)) return true;
  }
  return false;
};

export const firstCollision = (element: DnDElement, elements: DnDElement[]) => {
  return elements.find((candidate) => isCollision(element, candidate));
};
