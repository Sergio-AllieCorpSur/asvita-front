import { Link } from "react-router-dom";
import InlineEdit from "./InlineEdit";
import type { Folder, ID } from "../types";

export default function FolderCard({
  folder,
  dataroomId,
  onRename,
  onDelete,
}: {
  folder: Folder;
  dataroomId: ID;
  onRename: (name: string) => void;
  onDelete: () => void;
}) {
  return (
    <div className="card p-4 group">
      <Link
        to={`/d/${dataroomId}/f/${folder.id}`}
        className="block text-sm text-gray-500"
      >
        📁
      </Link>
      <InlineEdit value={folder.name} onSave={onRename} className="mt-2" />
      <div className="mt-3 flex gap-2">
        <Link className="btn-ghost" to={`/d/${dataroomId}/f/${folder.id}`}>
          Abrir
        </Link>
        <button
          className="btn-ghost text-red-600"
          onClick={onDelete}
          title="Eliminar carpeta (recursivo)"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
