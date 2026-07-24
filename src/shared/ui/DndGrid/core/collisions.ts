import { CoreDndElement } from "./type";

export const isCollision = (elements1: CoreDndElement, elements2: CoreDndElement) => {
  const isCollisionX =
    (elements1.x <= elements2.x && elements2.x < elements1.x + elements1.w) ||
    (elements2.x <= elements1.x && elements1.x < elements2.x + elements2.w);

  const isCollisionY =
    (elements1.y <= elements2.y && elements2.y < elements1.y + elements1.h) ||
    (elements2.y <= elements1.y && elements1.y < elements2.y + elements2.h);

  return isCollisionX && isCollisionY;
};

export const getAllCollisions = (
  element: CoreDndElement,
  elements: CoreDndElement[],
) => {
  return elements.filter((candidate) => {
    if (candidate.id === element.id) return false;
    return isCollision(element, candidate);
  });
};

export const isAllCollision = (element: CoreDndElement, elements: CoreDndElement[]) => {
  for (const candidate of elements) {
    if (isCollision(element, candidate)) return true;
  }
  return false;
};
