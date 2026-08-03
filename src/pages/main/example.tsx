"use client";
import DndGrid from "@/shared/ui/DndGrid/DndGrid";
import { useRef, useState } from "react";
import { DndElement } from "@/shared/ui/DndGrid/core/type";
export default function Home() {
  const [elements, setEl] = useState<DndElement<string>[]>([
    { id: "1", x: 0, y: 0, w: 8, h: 8, data: "Element 1" },
    { id: "2", x: 12, y: 0, w: 20, h: 30, data: "Element 2" },
    { id: "3", x: 0, y: 8, w: 8, h: 8, data: "Element 3" },
    { id: "4", x: 40, y: 0, w: 20, h: 30, data: "Element 4"},
    { id: "5", x: 40, y: 40, w: 20, h: 30, data: "Element 5"},
  ]);
  const renderItem = (item: (typeof elements)[0]) => {
    return <p>{item?.data}</p>;
  };
  const test = useRef<any>(null);

  const createEl = () => {
    setEl([...elements, test.current.getNewElement()]);
  };
  return (
    <>
      <DndGrid
        items={elements}
        renderItem={renderItem}
        ref={test}
        updateItems={setEl}
        gap={2}
      />
      <button onClick={createEl}>test</button>
    </>
  );
}
