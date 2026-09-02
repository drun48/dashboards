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
