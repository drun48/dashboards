"use client";

import { DragDropProvider } from "@dnd-kit/react";
import type { DragMoveEvent } from "@dnd-kit/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { moveElement, resizeElement } from "./core/moving";
import { ParamsDnDGrid, ResizeDirection } from "./core/type";
import { compactor } from "./core/compactor";
import { Draggable } from "./ItemGrid";

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

  const moving = useCallback(
    (e: DragMoveEvent) => {
      if (!state?.max || !e.operation.source) return;
      if (e.operation.source.type === "element-grid") {
        setElements((elements) => moveElement(e, { ...state, elements }));
      }
      if (e.operation.source.type === "resize") {
        setElements((elements) =>
          resizeElement(
            e,
            e.operation.source!.data.direction as ResizeDirection,
            { ...state, elements },
          ),
        );
      }
    },
    [state],
  );

  return (
    <DragDropProvider onDragMove={moving}>
      <div className="relative min-h-screen" ref={ref}>
        {elements.map((item) => {
          return (
            <Draggable
              params={{
                elements,
                ...state,
              }}
              {...item}
              key={item.id}
            ></Draggable>
          );
        })}
      </div>
    </DragDropProvider>
  );
}
