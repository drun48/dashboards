import { DnDElement } from "./type";

export const isCollision = (elements1: DnDElement, elements2: DnDElement) => {
  const isCollisionX =
    (elements1.x <= elements2.x && elements2.x < elements1.x + elements1.w) ||
    (elements2.x <= elements1.x && elements1.x < elements2.x + elements2.w);

  const isCollisionY =
    (elements1.y <= elements2.y && elements2.y < elements1.y + elements1.h) ||
    (elements2.y <= elements1.y && elements1.y < elements2.y + elements2.h);

  return isCollisionX && isCollisionY;
};

export const getAllCollisions = (
  element: DnDElement,
  elements: DnDElement[],
) => {
  return elements.filter((el) => {
    if (el.id === element.id) return false;
    return isCollision(element, el);
  });
};

// export const getAllCollisionsUp = (
//   element: DnDElement,
//   elements: DnDElement[],
// ) => {
//   const collisions = [];
//   for (const el of elements) {
//     if (el.y > element.y) break;
//     if (isCollision(el, element) && el.id !== element.id) collisions.push(el);
//   }
//   return collisions;
// };
