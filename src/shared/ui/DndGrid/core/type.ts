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
  initElements:DnDElement[],
  step: number;
  minCuts: number;
  min?: Point;
  max?: Point;
};

export type ResizeDirection = "rb" | "lb";
