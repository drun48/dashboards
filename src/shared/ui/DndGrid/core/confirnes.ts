import { MoveItem, Point } from "./type";

export const normalizePosition = (position: Point, max: Point, min: Point) => {
  const x = Math.max(Math.min(position.x, max.x), min.x);
  const y = Math.max(Math.min(position.y, max.y), min.y);
  return {
    x,
    y,
  };
};

export const fromNormalToGlobalPostion = (position: Point, step: number) => {
  return {
    x: position.x * step,
    y: position.y * step,
  };
};

export const fromGlobalToNormalPosition = (position: Point, step: number) => {
  return {
    x: Math.round(position.x / step),
    y: Math.round(position.y / step),
  };
};

export const getNewPosition = (
  element: MoveItem,
  offsetPoint: Point,
  step: number,
  max: Point,
  min: Point,
) => {
  const { x: prevX, y: prevY } = fromNormalToGlobalPostion(
    { x: element.x, y: element.y },
    step,
  );
  const { x, y } = fromGlobalToNormalPosition(
    { x: prevX + offsetPoint.x, y: prevY + offsetPoint.y },
    step,
  );

  return normalizePosition({ x, y }, max, min);
};
