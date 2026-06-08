import { ParamsDnDGrind, Point } from "./type";

export const normalizePosition = (
  position: Point,
  { max, min }: ParamsDnDGrind,
) => {
  const x = Math.max(Math.min(position.x, max?.x ?? Infinity), min?.x ?? 0);
  const y = Math.max(Math.min(position.y, max?.y ?? Infinity), min?.y ?? 0);
  return {
    x,
    y,
  };
};

export const fromNormalToGlobalPostion = (
  position: Point,
  { step }: ParamsDnDGrind,
) => {
  return {
    x: position.x * step,
    y: position.y * step,
  };
};

export const fromGlobalToNormalPosition = (
  position: Point,
  { step }: ParamsDnDGrind,
) => {
  return {
    x: Math.round(position.x / step),
    y: Math.round(position.y / step),
  };
};
