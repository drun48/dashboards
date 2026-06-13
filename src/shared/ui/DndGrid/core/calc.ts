import { ParamsDnDGrid, Point } from "./type";

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

export const fromNormalToGlobalCoords = (
  position: Point,
  { step }: ParamsDnDGrid,
) => {
  return {
    x: position.x * step,
    y: position.y * step,
  };
};

export const fromGlobalToNormalCoords = (
  position: Point,
  { step }: ParamsDnDGrid,
) => {
  return {
    x: Math.round(position.x / step),
    y: Math.round(position.y / step),
  };
};

export const differencePoint = (point1: Point, point2: Point) => {
  return {
    x: point1.x - point2.x,
    y: point1.y - point2.y,
  };
}

export const plusPoint = (point1: Point, point2: Point) => {
  return {
    x: point1.x + point2.x,
    y: point1.y + point2.y,
  };
}
