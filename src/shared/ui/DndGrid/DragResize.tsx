import { useDraggable } from "@dnd-kit/react";
import { ParamsDnDGrid, ResizeDirection } from "./core/type";

interface ResizeHandleProps {
  elementId: string | number;
  direction: ResizeDirection;
  params: ParamsDnDGrid;
}

export function ResizeHandle({ elementId, direction }: ResizeHandleProps) {
  const { ref, isDragSource } = useDraggable({
    id: `resize-${elementId}-${direction}`,
    data: { elementId, direction },
    type: "resize",
  });

  const getPositionStyle = (): React.CSSProperties => {
    const size = 12;
    const half = size / 2;

    const positions: Record<ResizeDirection, React.CSSProperties> = {
      rb: { bottom: -half, right: -half, cursor: "nwse-resize" },
      lb: { bottom: -half, left: -half, cursor: "nesw-resize" },
    };

    return {
      position: "absolute",
      width: size,
      height: size,
      backgroundColor: isDragSource ? "#3b82f6" : "#6b7280",
      borderRadius: "50%",
      border: "2px solid white",
      zIndex: 10,
      ...positions[direction],
    };
  };

  return <div ref={ref} style={getPositionStyle()} />;
}
