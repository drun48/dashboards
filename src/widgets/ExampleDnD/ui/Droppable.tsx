import { useDroppable } from "@dnd-kit/react";
import { CollisionPriority } from "@dnd-kit/abstract";

export default function Droppable({ id, children, className }) {
  const { ref } = useDroppable({
    id,
    type: "column",
    accept: "item",
    collisionPriority: CollisionPriority.Low,
  });

  return (
    <div
      ref={ref}
      className={`border border-solid w-2xs h-96 ${className || ""}`}
    >
      {children}
    </div>
  );
}
