export type DnDElement = {
  x: number;
  y: number;
  w: number;
  h: number;
  id: string;
};

export type Point = {
  x: number;
  y: number;
};

export type ParamsDnDGrid = {
  elements: DnDElement[];
  step: number;
  minCuts: number;
  min?: Point;
  max?: Point;
};

export type VectorSize = {
  x: -1 | 0 | 1;
  y: -1 | 0 | 1;
  widthOffset: number;
  heightOffset: number;
};

export type ResizeDirection = "lt" | "rt" | "rb" | "lb";
