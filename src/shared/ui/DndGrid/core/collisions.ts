import { MoveItem } from "./type";

export const isCollision = (elements1: MoveItem, elements2: MoveItem) => {
  const isCollisionX =
    (elements1.x <= elements2.x && elements2.x < elements1.x + elements1.w) ||
    (elements2.x <= elements1.x && elements1.x < elements2.x + elements2.w);

  const isCollisionY =
    (elements1.y <= elements2.y && elements2.y < elements1.y + elements1.h) ||
    (elements2.y <= elements1.y && elements1.y < elements2.y + elements2.h);

  return isCollisionX && isCollisionY;
};

export const getAllCollisions = (element: MoveItem, elements: MoveItem[]) => {
  return elements.filter((el) => {
    if (el.id === element.id) return false;
    return isCollision(element, el);
  });
};
