import { DragDropProvider, DragMoveEvent, useDraggable } from "@dnd-kit/react";
import { useCallback, useEffect, useRef, useState } from "react";

type Items = {
  x?: number;
  y?: number;
  w: number;
  h: number;
  id: string;
};

export default function DndGrid() {
  const size = 50;
  const minСuts = 20;

  const [grid, setGrid] = useState();
  const [state, setState] = useState<{
    maxX: number;
    maxY: number;
  }>();
  const ref = useRef<HTMLDivElement | null>(null);

  const [items, setItems] = useState<Items[]>([
    { id: "1", w: 3, h: 3 },
    { id: "2", w: 3, h: 3 },
    { id: "3", w: 3, h: 3 },
  ]);

  useEffect(() => {
    if (!ref.current) return;
    const { width, height } = ref.current?.getBoundingClientRect();
    const x = Math.max(Math.floor(width / size), minСuts);
    const y = Math.floor(height / size);

    setState({ maxX: x, maxY: y });
  }, [ref]);

  useEffect(() => {
    if (!state?.maxX || !state?.maxY) return;
    const matrix = Array.from({ length: state.maxY }, () =>
      new Array(state.maxX).fill(null),
    );
    
  }, [state]);

  const move = useCallback(
    (e: DragMoveEvent) => {
      console.log(e);
    },
    [grid],
  );

  function Draggable({ id, x, y, w, h }: Items) {
    const { ref } = useDraggable({
      id: id,
    });
    return (
      <button
        className={`border border-solid w-[${w * size}px] h-[${h * size}px] flex`}
        ref={ref}
      >
        {id}
      </button>
    );
  }

  return (
    <DragDropProvider onDragMove={move}>
      <div ref={ref}>
        {items.map((item) => {
          return <Draggable {...item} key={item.id}></Draggable>;
        })}
      </div>
    </DragDropProvider>
  );
}
