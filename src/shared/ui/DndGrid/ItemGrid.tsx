import { useDraggable } from "@dnd-kit/react";
import { DndElement, ParamsDnDGrid, ResizeDirection } from "./core/type";
import { ResizeHandle } from "./DragResize";
import { memo, PropsWithChildren } from "react";


export const ItemGrid = function ItemGrid({
  id,
  x,
  y,
  w,
  h,
  params,
  children,
}: PropsWithChildren<DndElement & { params: ParamsDnDGrid }>) {
  const { ref, isDragSource, handleRef } = useDraggable({
    id: id,
    type: "element-grid",
  });
  const directions: ResizeDirection[] = ["rb", "lb"];
  const getView = (x: number, y: number) => {
    return (
      <div
        className="absolute border border-solid flex bg-white"
        ref={ref}
        style={{
          width: `${w * params.step}px`,
          height: `${h * params.step}px`,
          left: `${x * params.step}px`,
          top: `${y * params.step}px`,
          opacity: isDragSource ? 0.5 : 1,
        }}
      >
        <div className="relative w-full h-full" ref={handleRef}>
          {children}
          {directions.map((dir) => (
            <ResizeHandle
              key={dir}
              elementId={id}
              direction={dir}
              params={params}
            />
          ))}
        </div>
      </div>
    );
  };
  const getProjection = (x: number, y: number) => {
    return (
      <div
        className="absolute bg-amber-950"
        style={{
          width: `${w * params.step}px`,
          height: `${h * params.step}px`,
          left: `${x * params.step}px`,
          top: `${y * params.step}px`,
        }}
      ></div>
    );
  };
  return (
    <>
      {getView(x, y)}
      {isDragSource && <>{getProjection(x, y)}</>}
    </>
  );
};
