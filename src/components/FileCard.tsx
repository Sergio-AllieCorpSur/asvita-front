import InlineEdit from "./InlineEdit";
import type { FileItem } from "../types";

export default function FileCard({
  item,
  onOpen,
  onRename,
  onDelete,
}: {
  item: FileItem;
  onOpen: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
}) {
  return (
    <div className="card p-4">
      <div className="text-sm text-gray-500">📄 PDF</div>
      <InlineEdit value={item.name} onSave={onRename} className="mt-2" />
      <div className="mt-3 flex gap-2">
        <button className="btn-ghost" onClick={onOpen}>Ver</button>
        <button className="btn-ghost text-red-600" onClick={onDelete}>
          Eliminar
        </button>
      </div>
    </div>
  );
}
