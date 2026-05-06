import { useSortable } from "@dnd-kit/react/sortable";
export default function Draggable({ id, dataDraggable }) {
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
