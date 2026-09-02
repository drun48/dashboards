"use client";

import { DragDropProvider, DragOverlay, useDroppable } from "@dnd-kit/react";
import type { DragMoveEvent, DragStartEvent } from "@dnd-kit/react";
import { Feedback } from "@dnd-kit/dom";
import { SnapModifier } from "@dnd-kit/abstract/modifiers";
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
  const initialScroll = useRef({ x: 0, y: 0 });

  const elements = useMemo(() => items, [items]);

  useEffect(() => {
    if (!containerRef.current) return;
    const { width } = containerRef.current?.getBoundingClientRect();
    const x = Math.max(Math.floor(width / state.step), state.minCuts);
    setState({
      ...state,
      max: { x: x * 300, y: Infinity },
      min: { x: 0, y: 0 },
    });
  }, []);

  const startMoving = useCallback(
    (e: DragStartEvent) => {
      setInitMovingElements([...elements]);
      if (containerRef.current) {
        initialScroll.current = {
          x: containerRef.current.scrollLeft,
          y: containerRef.current.scrollTop,
        };
      }
    },
    [elements],
  );

  const endMoving = useCallback(() => {
    setInitMovingElements([]);
  }, []);
  const moving = useCallback(
    (e: DragMoveEvent) => {
      if (
        !state?.max ||
        !e.operation.source ||
        !updateItems ||
        !containerRef.current
      )
        return;
      const container = containerRef.current;

      const scrollDelta = container
        ? {
            x: container.scrollLeft - initialScroll.current.x,
            y: container.scrollTop - initialScroll.current.y,
          }
        : { x: 0, y: 0 };

      const transform = {
        x: Math.round((e.operation.transform.x + scrollDelta.x) / state.step),
        y: Math.round((e.operation.transform.y + scrollDelta.y) / state.step),
      };
      let data;
      if (e.operation.source.type === "element-grid") {
        const directionY =
          e.operation.position.velocity.y !== 0
            ? e.operation.position.velocity.y /
              Math.abs(e.operation.position.velocity.y)
            : 0;
        data = moveElement(
          { transform, id: e.operation.source.id as string, directionY },
          {
            ...state,
            elements,
            initElements: initMovingElements,
            gap: gap ?? 0,
          },
        );
      }
      if (e.operation.source.type === "resize") {
        data = resizeElement(
          { transform, id: e.operation.source.id as string },
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
      modifiers={[
        SnapModifier.configure({
          size: state.step,
        }),
      ]}
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
        {elements.map((item) => {
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
