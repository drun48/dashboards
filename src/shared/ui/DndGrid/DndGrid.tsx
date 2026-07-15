"use client";

import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import type { DragMoveEvent, DragStartEvent } from "@dnd-kit/react";
import { Feedback } from "@dnd-kit/dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { moveElement, resizeElement } from "./core/moving";
import { DnDElement, ParamsDnDGrid, ResizeDirection } from "./core/type";
import { ItemGrid } from "./ItemGrid";

type Item<T> = DnDElement & { data?: T };

interface Props<T = unknown> {
  items: Item<T>[];
  renderItem?: (item: Item<T>) => React.ReactNode;
}

export default function DndGrid({ items, renderItem }: Props) {
  const [state, setState] = useState<Omit<ParamsDnDGrid, "elements">>({
    step: 10,
    minCuts: 30,
    initElements: [],
  });
  const [activeId, setActiveId] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  const [elements, setElements] = useState<Item<T>[]>([]);

  const [initMovingElements, setInitMovingElements] = useState<DnDElement[]>(
    [],
  );

  useEffect(() => {
    setElements([...items]);
  }, [items]);

  useEffect(() => {
    if (!ref.current) return;
    const { width } = ref.current?.getBoundingClientRect();
    const x = Math.max(Math.floor(width / state.step), state.minCuts);
    setState({ ...state, max: { x: x, y: Infinity }, min: { x: 0, y: 0 } });
  }, []);

  const startMoving = useCallback(
    (e: DragStartEvent) => {
      setInitMovingElements([...elements]);
      setActiveId(e.operation.source?.id as string);
    },
    [elements],
  );

  const endMoving = useCallback(() => {
    setActiveId(null);
    setInitMovingElements([]);
  }, []);

  const moving = useCallback(
    (e: DragMoveEvent) => {
      if (!state?.max || !e.operation.source) return;
      if (e.operation.source.type === "element-grid") {
        setElements((elements) =>
          moveElement(e, {
            ...state,
            elements,
            initElements: initMovingElements,
          }),
        );
      }
      if (e.operation.source.type === "resize") {
        setElements((elements) =>
          resizeElement(
            e,
            e.operation.source!.data.direction as ResizeDirection,
            { ...state, elements, initElements: initMovingElements },
          ),
        );
      }
    },
    [state, initMovingElements],
  );

  const activeElement = elements.find((el) => el.id === activeId);
  return (
    <DragDropProvider
      onDragMove={moving}
      onDragStart={startMoving}
      onDragEnd={endMoving}
      plugins={(defaults) => [
        ...defaults,
        Feedback.configure({
          dropAnimation: {
            duration: 100,
            easing: "ease-out",
          },
        }),
      ]}
    >
      <div className="relative min-h-screen" ref={ref}>
        {elements.map((item) => {
          return (
            <ItemGrid
              params={{
                elements,
                ...state,
              }}
              {...item}
              key={item.id}
            >
              {renderItem ? renderItem(item) : null}
            </ItemGrid>
          );
        })}
      </div>
      <DragOverlay>
        {activeElement && (
          <div
            className="border border-solid flex bg-white opacity-70"
            style={{
              width: `${activeElement.w * state.step}px`,
              height: `${activeElement.h * state.step}px`,
            }}
          >
            {renderItem ? renderItem(activeElement) : null}
          </div>
        )}
      </DragOverlay>
    </DragDropProvider>
  );
}
