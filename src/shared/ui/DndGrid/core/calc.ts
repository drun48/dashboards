import { CoreDndElement, ParamsDnDGrid, Point } from "./type";

export const normalizePosition = (
  position: Point,
  { max, min }: ParamsDnDGrid,
) => {
  const x = Math.max(Math.min(position.x, max?.x ?? Infinity), min?.x ?? 0);
  const y = Math.max(Math.min(position.y, max?.y ?? Infinity), min?.y ?? 0);
  return {
    x,
    y,
  };
};

export const normalizePositionElement = (
  element: CoreDndElement,
  { max, min }: ParamsDnDGrid,
) => {
  let x = element.x;
  let y = element.y;
  if (typeof max?.x === "number" && element.x + element.w > max?.x) {
    x = max.x - element.w;
  }
  if (typeof max?.y === "number" && element.y + element.h > max.y) {
    y = max.y - element.h;
  }
  if (typeof min?.x === "number" && element.x < min.x) {
    x = min.x;
  }
  if (typeof min?.y === "number" && element.y < min.y) {
    y = min.y;
  }

  return { x, y };
};
