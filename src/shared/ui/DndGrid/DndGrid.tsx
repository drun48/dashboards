"use client";

import { DragDropProvider, DragOverlay, useDraggable } from "@dnd-kit/react";
import type { DragMoveEvent } from "@dnd-kit/react";
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
    { id: "4", x: 40, y: 0, w: 20, h: 30 },
    { id: "5", x: 40, y: 40, w: 20, h: 30 },
  ]);

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

  const test = useCallback(
    (e: DragMoveEvent) => {
      if (!state?.maxX) return;

      setItems((currentItems) =>
        startMove(
          e,
          currentItems,
          step,
          { x: state.maxX, y: Infinity },
          { x: 0, y: 0 },
        ),
      );
    },
    [state],
  );

  function Draggable({ id, x, y, w, h }: Rectangle) {
    const { ref, isDragSource } = useDraggable({
      id: id,
    });
    const getView = (x: number, y: number) => {
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
      {state && (
        <p>
          Max X: {state.maxX}, Max Y: {state.maxY}
        </p>
      )}
      <div className="relative min-h-screen" ref={ref}>
        {items.map((item) => {
          return <Draggable {...item} key={item.id}></Draggable>;
        })}
      </div>
    </DragDropProvider>
  );
}
