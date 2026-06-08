"use client";

import { DragDropProvider, DragOverlay, useDraggable } from "@dnd-kit/react";
import type { DragMoveEvent } from "@dnd-kit/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { moveElement } from "./core/moving";
import { ParamsDnDGrid } from "./core/type";
import { compactor } from "./core/compactor";

type Rectangle = {
  x: number;
  y: number;
  w: number;
  h: number;
  id: string;
};

export default function DndGrid() {
  const [state, setState] = useState<Omit<ParamsDnDGrid, "elements">>({
    step: 10,
    minCuts: 30,
  });
  const ref = useRef<HTMLDivElement | null>(null);

  const [elements, setElements] = useState(
    compactor([
      { id: "1", x: 0, y: 0, w: 8, h: 8 },
      { id: "2", x: 12, y: 0, w: 20, h: 30 },
      { id: "3", x: 0, y: 8, w: 8, h: 8 },
      { id: "4", x: 40, y: 0, w: 20, h: 30 },
      { id: "5", x: 40, y: 40, w: 20, h: 30 },
    ]),
  );

  useEffect(() => {
    if (!ref.current) return;
    const { width } = ref.current?.getBoundingClientRect();
    const x = Math.max(Math.floor(width / state.step), state.minCuts);

    setState({ ...state, max: { x: x, y: Infinity }, min: { x: 0, y: 0 } });
  }, []);

  const startMove = useCallback(
    (e: DragMoveEvent) => {
      if (!state?.max) return;

      setElements((elements) => moveElement(e, { ...state, elements }));
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
            width: `${w * state.step}px`,
            height: `${h * state.step}px`,
            left: `${x * state.step}px`,
            top: `${y * state.step}px`,
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
            width: `${w * state.step}px`,
            height: `${h * state.step}px`,
            left: `${x * state.step}px`,
            top: `${y * state.step}px`,
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
    <DragDropProvider onDragMove={startMove}>
      {state.max && <p>Max X: {state.max.x}</p>}
      <div className="relative min-h-screen" ref={ref}>
        {elements.map((item) => {
          return <Draggable {...item} key={item.id}></Draggable>;
        })}
      </div>
    </DragDropProvider>
  );
}
