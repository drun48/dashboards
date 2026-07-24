export type DnDElementParams = {
  x: number;
  y: number;
  w: number;
  h: number;
  id: string;
};


export type CoreDndElement = DnDElementParams & { data?: any };
export type DndElement<T = unknown> = DnDElementParams & { data?: T };

export type Point = {
  x: number;
  y: number;
};

export type ParamsDnDGrid = {
  elements: CoreDndElement[];
  initElements: CoreDndElement[];
  step: number;
  minCuts: number;
  min?: Point;
  max?: Point;
};

export type ResizeDirection = "rb" | "lb";
