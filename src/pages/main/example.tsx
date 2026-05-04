"use client";
import { useDroppable } from "@dnd-kit/react";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortable, useSortable } from "@dnd-kit/react/sortable";
import { CollisionPriority } from "@dnd-kit/abstract";
import { useState } from "react";
export default function Home() {
  type Card = {
    id: string;
    dataDraggable: {
      columnId: string;
      index: number;
    };
  };
  const [groups, setGroups] = useState<Record<string, Card[]>>({
    draggable1: [
      {
        id: "1",
        dataDraggable: {
          columnId: "draggable1",
          index: 0,
        },
      },
      {
        id: "2",
        dataDraggable: {
          columnId: "draggable1",
          index: 1,
        },
      },
      {
        id: "3",
        dataDraggable: {
          columnId: "draggable1",
          index: 2,
        },
      },
      {
        id: "4",
        dataDraggable: {
          columnId: "draggable1",
          index: 3,
        },
      },
    ],
    draggable2: [],
  });

  function Droppable({ id, children, className }) {
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

  function Draggable({ id, dataDraggable }) {
    const { ref } = useSortable({
      id: id,
      group: dataDraggable.columnId,
      index: dataDraggable.index,
      type: "item",
      accept: "item",
    });
    return (
      <button className={`border border-solid w-10 h-10`} ref={ref}>
        {id}
        {dataDraggable.index}
      </button>
    );
  }

  return (
    <DragDropProvider
      onDragEnd={(event) => {
        if (event.canceled || !event.operation.source?.id) return;
        const { source, target } = event.operation;
        if (!isSortable(source) || !target) return;
        const { initialIndex, index, initialGroup, group } = source;
        if (!initialGroup || !group) return;

        setGroups((prev) => {
          const sourceGroup = [
            ...prev[initialGroup].slice(0, initialIndex),
            ...prev[initialGroup].slice(initialIndex).map((item) => ({
              ...item,
              dataDraggable: {
                ...item.dataDraggable,
                index: item.dataDraggable.index - 1,
              },
            })),
          ];
          const [replaceItem] = sourceGroup.splice(initialIndex, 1);

          const newIndex =
            target.type === "column"
              ? target.id !== initialGroup
                ? prev[target.id].length
                : prev[target.id].length - 1
              : index;

          const newGroup =
            target.type === "column" && target.id !== initialGroup
              ? target.id
              : group;

          replaceItem.dataDraggable.index = newIndex;

          if (initialGroup === newGroup) {
            sourceGroup.splice(newIndex, 0, replaceItem);
            return {
              ...prev,
              [initialGroup]: [
                ...sourceGroup.slice(0, newIndex + 1),
                ...sourceGroup.slice(newIndex + 1).map((item) => ({
                  ...item,
                  dataDraggable: {
                    ...item.dataDraggable,
                    index: item.dataDraggable.index + 1,
                  },
                })),
              ],
            };
          }

          const targetGroup = [...prev[newGroup]];
          targetGroup.splice(newIndex, 0, replaceItem);
          replaceItem.dataDraggable.columnId = newGroup as string;

          return {
            ...prev,
            [initialGroup]: sourceGroup,
            [newGroup]: [
              ...targetGroup.slice(0, newIndex + 1),
              ...targetGroup.slice(newIndex + 1).map((item) => ({
                ...item,
                dataDraggable: {
                  ...item.dataDraggable,
                  index: item.dataDraggable.index + 1,
                },
              })),
            ],
          };
        });
      }}
    >
      <Droppable id="draggable1">
        {groups["draggable1"].map((item) => (
          <Draggable
            key={item.id}
            id={item.id}
            dataDraggable={item.dataDraggable}
          />
        ))}
      </Droppable>
      <Droppable id="draggable2">
        {groups["draggable2"].map((item) => (
          <Draggable
            key={item.id}
            id={item.id}
            dataDraggable={item.dataDraggable}
          />
        ))}
      </Droppable>
    </DragDropProvider>
  );
}
