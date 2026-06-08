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

export type ParamsDnDGrind = {
  elements: DnDElement[];
  step: number;
  minСuts: number;
  min?: Point;
  max?: Point;
};
