import { CoreDndElement } from "./type";

export class DnDElement implements CoreDndElement {
  x: number;
  y: number;
  w: number;
  h: number;
  id: string;
  gap?: number;
  data: any;
  constructor({
    x,
    y,
    w,
    h,
    id,
    gap,
    data,
  }: CoreDndElement & { gap?: number }) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.id = id;
    this.data = data;
    this.gap = gap;
  }

  getLeft() {
    return this.x - (this?.gap ?? 0) / 2;
  }

  getRight() {
    return this.x + this.w + (this?.gap ?? 0) / 2;
  }

  getTop() {
    return this.y - (this?.gap ?? 0) / 2;
  }

  getBottom() {
    return this.y + this.h + (this?.gap ?? 0) / 2;
  }
}
