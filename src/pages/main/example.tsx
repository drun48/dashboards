"use client";
import DndGrid from "@/shared/ui/DndGrid/DndGrid";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import { DndElement } from "@/shared/ui/DndGrid/core/type";
import { Chart } from "@/entities/chart";
import { faker } from "@faker-js/faker";
const MemoizedChart = memo(Chart);

export default function Home() {
  const [elements, setEl] = useState<DndElement<string>[]>([
    { id: "1", x: 0, y: 0, w: 8, h: 8, data: "Element 1" },
    { id: "2", x: 12, y: 0, w: 20, h: 20, data: "Element 2" },
    { id: "3", x: 0, y: 8, w: 8, h: 8, data: "Element 3" },
    { id: "4", x: 40, y: 0, w: 20, h: 20, data: "Element 4" },
    { id: "5", x: 40, y: 40, w: 20, h: 20, data: "Element 5" },
  ]);
  const labels = useMemo(
    () => ["January", "February", "March", "April", "May", "June", "July"],
    [],
  );
  const data = useMemo(
    () => [
      {
        type: "line",
        label: "Dataset 1",
        data: labels.map(() => faker.number.int({ min: -1000, max: 1000 })),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        type: "bar" as const,
        label: "Dataset 2",
        backgroundColor: "rgb(75, 192, 192)",
        data: labels.map(() => faker.number.int({ min: -1000, max: 1000 })),
        borderColor: "white",
        borderWidth: 2,
      },
      {
        type: "bar" as const,
        label: "Dataset 3",
        backgroundColor: "rgb(53, 162, 235)",
        data: labels.map(() => faker.number.int({ min: -1000, max: 1000 })),
      },
    ],
    [labels],
  );

  const renderItem = useCallback(
    (item: (typeof elements)[0]) => {
      return <MemoizedChart labels={labels} data={data} key={item.id}/>;
    },
    [labels, data],
  );
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
        gap={1}
      />
      <button onClick={createEl}>test</button>
    </>
  );
}
