export interface DnDElementParams {
  x: number;
  y: number;
  w: number;
  h: number;
  id: string;
}

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
  gap: number;
};

export type ResizeDirection = "rb" | "lb";

export type EventMoving = {
  transform: { x: number; y: number };
  id: string;
};
