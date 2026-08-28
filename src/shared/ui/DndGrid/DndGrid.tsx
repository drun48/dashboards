"use client";

import { DragDropProvider } from "@dnd-kit/react";
import type { DragMoveEvent, DragStartEvent } from "@dnd-kit/react";
import { Feedback } from "@dnd-kit/dom";
import {
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { createDndElement, moveElement, resizeElement } from "./core/core";
import { DndElement, ParamsDnDGrid, ResizeDirection } from "./core/type";
import { ItemGrid } from "./ItemGrid";

interface Props<T> {
  items: DndElement<T>[];
  updateItems?: (data: DndElement<T>[]) => void;
  renderItem?: (item: DndElement<T>) => React.ReactNode;
  ref: Ref<{
    getNewElement: (options: {
      width: number;
      height: number;
    }) => DndElement<T>;
  }>;
  gap?: number;
}

export default function DndGrid<T>({
  items,
  renderItem,
  updateItems,
  ref,
  gap,
}: Props<T>) {
  const [state, setState] = useState<Omit<ParamsDnDGrid, "elements" | "gap">>({
    step: 20,
    minCuts: 30,
    initElements: [],
  });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [initMovingElements, setInitMovingElements] = useState<DndElement<T>[]>(
    [],
  );

  const elements = useMemo(() => items, [items]);

  useEffect(() => {
    if (!containerRef.current) return;
    const { width } = containerRef.current?.getBoundingClientRect();
    const x = Math.max(Math.floor(width / state.step), state.minCuts);
    setState({ ...state, max: { x: x, y: Infinity }, min: { x: 0, y: 0 } });
  }, []);

  const startMoving = useCallback(
    (e: DragStartEvent) => {
      setInitMovingElements([...elements]);
    },
    [elements],
  );

  const endMoving = useCallback(() => {
    setInitMovingElements([]);
  }, []);

  const moving = useCallback(
    (e: DragMoveEvent) => {
      if (!state?.max || !e.operation.source || !updateItems) return;
      let data;
      if (e.operation.source.type === "element-grid") {
        data = moveElement(e, {
          ...state,
          elements,
          initElements: initMovingElements,
          gap: gap ?? 0,
        });
      }
      if (e.operation.source.type === "resize") {
        data = resizeElement(
          e,
          e.operation.source!.data.direction as ResizeDirection,
          {
            ...state,
            elements,
            initElements: initMovingElements,
            gap: gap ?? 0,
          },
        );
      }
      if (data) {
        updateItems(data);
      }
    },
    [state, updateItems, elements, initMovingElements, gap],
  );

  useImperativeHandle(ref, () => {
    return {
      getNewElement: ({ width, height } = { width: 15, height: 15 }) => {
        return createDndElement(
          { w: width, h: height },
          {
            ...state,
            elements,
            initElements: initMovingElements,
            gap: gap ?? 0,
          },
        );
      },
    };
  }, [state, elements, initMovingElements, gap]);
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
      <div className="relative min-h-screen overflow-auto" ref={containerRef}>
        {elements.map(item => {
          return (
            <ItemGrid
              params={{
                elements,
                ...state,
                gap: gap ?? 0,
              }}
              {...item}
              key={item.id}
            >
              {renderItem ? renderItem(item) : null}
            </ItemGrid>
          );
        })}
      </div>
    </DragDropProvider>
  );
}
