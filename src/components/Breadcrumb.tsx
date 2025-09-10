import { Link } from "react-router-dom";
import type { ID } from "../types";

export default function Breadcrumb({
  dataroomId,
  folderId,
}: {
  dataroomId: ID;
  folderId?: ID | null;
}) {
  return (
    <nav className="text-sm text-gray-600">
      <Link className="hover:underline" to="/">Datarooms</Link>
      <span className="mx-1">/</span>
      <Link className="hover:underline" to={`/d/${dataroomId}`}>Dataroom {dataroomId}</Link>
      {folderId && (
        <>
          <span className="mx-1">/</span>
          <span className="font-medium">Folder {folderId}</span>
        </>
      )}
    </nav>
  );
}
