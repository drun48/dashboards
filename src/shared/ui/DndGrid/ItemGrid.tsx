import { useDraggable } from "@dnd-kit/react";
import { DnDElement, ParamsDnDGrid, ResizeDirection } from "./core/type";
import { ResizeHandle } from "./DragResize";

export function Draggable({
  id,
  x,
  y,
  w,
  h,
  params,
}: DnDElement & { params: ParamsDnDGrid }) {
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
          visibility: isDragSource ? "hidden" : "visible",
        }}
      >
        <div className="relative w-full h-full" ref={handleRef}>
          {id}
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
}
