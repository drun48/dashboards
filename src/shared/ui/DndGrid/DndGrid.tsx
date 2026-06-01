"use client";

import {
  DragDropProvider,
  DragMoveEvent,
  DragOverlay,
  useDraggable,
} from "@dnd-kit/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { startMove } from "./core/moving";

type Rectangle = {
  x: number;
  y: number;
  w: number;
  h: number;
  id: string;
};

export default function DndGrid() {
  const step = 10;
  const minСuts = 20;

  const [state, setState] = useState<{
    maxX: number;
    maxY: number;
  }>();
  const ref = useRef<HTMLDivElement | null>(null);

  const [items, setItems] = useState<Rectangle[]>([
    { id: "1", x: 0, y: 0, w: 8, h: 8 },
    { id: "2", x: 12, y: 0, w: 20, h: 30 },
    { id: "3", x: 0, y: 8, w: 8, h: 8 },
  ]);

  const swapRectange = (i1: number, i2: number, items: Rectangle[]) => {
    const rectangle1 = items[i1];
    const rectangle2 = items[i2];
    rectangle1.y = rectangle2.y;
    rectangle2.y = rectangle1.y + rectangle1.h;

    items[i1] = rectangle2;
    items[i2] = rectangle1;
  };

  useEffect(() => {
    if (!ref.current) return;
    const { width, height } = ref.current?.getBoundingClientRect();
    const x = Math.max(Math.floor(width / step), minСuts);
    const y = Math.floor(height / step);

    setState({ maxX: x, maxY: y });
  }, [ref]);

  useEffect(() => {
    if (!state?.maxX || !state?.maxY) return;
  }, [state]);

  const move = useCallback((e: DragMoveEvent) => {
    setItems((items) => {
      const { x: offsetX, y: offsetY } = e.operation.position.velocity;
      const offsetNormalY =
        e.operation.position.velocity.y === 0
          ? -1
          : e.operation.position.velocity.y;
      const duration = offsetNormalY / Math.abs(offsetNormalY);
      const copyItems = [...items];
      const findIndex = copyItems.findIndex(
        (el) => el.id === e.operation.source?.id,
      );
      if (findIndex === -1) return copyItems;

      const [element] = copyItems.splice(findIndex, 1);
      const prevX = element.x * step;
      const prevY = element.y * step;

      const newX = Math.max(Math.round((prevX + offsetX) / step), 0);
      const newY = Math.max(Math.round((prevY + offsetY) / step), 0);

      const groupY = new Map();
      copyItems
        .sort((a, b) => a.x - b.x)
        .forEach((el) => {
          if (!groupY.has(el.y)) {
            groupY.set(el.y, []);
          }
          groupY.get(el.y).push(el);
        });
      // console.log(groupY);
      if (!groupY.has(newY)) {
        copyItems.push({ ...element, x: newX, y: newY });
        return copyItems;
      }

      // if (duration > 0) {
      //   for (let i = indexEl + 1; i < sortItems.length; ++i) {
      //     if (!isCollision(sortItems[i - 1], sortItems[i])) break;
      //     swapRectange(i, i - 1, sortItems);
      //   }
      // } else {
      //   for (let i = indexEl - 1; i >= 0; --i) {
      //     if (!isCollision(sortItems[i + 1], sortItems[i])) break;
      //     swapRectange(i + 1, i, sortItems);
      //   }
      // }
      return copyItems;
    });
  }, []);

  const test = useCallback(
    (e: DragMoveEvent) => {
      const elements = startMove(
        e,
        items,
        step,
        { x: state?.maxX || 0, y: Infinity },
        { x: 0, y: 0 },
      );
      setItems(elements);
    },
    [items, state],
  );

  function Draggable({ id, x, y, w, h }: Rectangle) {
    const { ref, isDragSource } = useDraggable({
      id: id,
    });
    const getView = (x, y) => {
      return (
        <button
          className="absolute border border-solid flex"
          style={{
            width: `${w * step}px`,
            height: `${h * step}px`,
            left: `${x * step}px`,
            top: `${y * step}px`,
          }}
          ref={ref}
        >
          {id}
        </button>
      );
    };
    const getViewDrag = () => {
      return (
        <div
          className="absolute bg-amber-950"
          style={{
            width: `${w * step}px`,
            height: `${h * step}px`,
            left: `${x * step}px`,
            top: `${y * step}px`,
          }}
        >
          {x} {y}
        </div>
      );
    };
    return (
      <>
        {!isDragSource && getView(x, y)}
        {isDragSource && (
          <>
            {getViewDrag()}
            <DragOverlay>{getView(0, 0)}</DragOverlay>
          </>
        )}
      </>
    );
  }

  return (
    <DragDropProvider onDragMove={test}>
      {state && <p>Max X: {state.maxX}, Max Y: {state.maxY}</p>}
      <div className="relative" ref={ref}>
        {items.map((item) => {
          return <Draggable {...item} key={item.id}></Draggable>;
        })}
      </div>
    </DragDropProvider>
  );
}
