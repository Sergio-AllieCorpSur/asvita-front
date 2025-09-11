import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFolder, deleteFile, deleteFolder, fileStreamUrl,
  getFolderContents, renameFile, renameFolder, uploadPdf
} from "../lib/api";
import type { ID, Folder, FileItem } from "../types";
import Breadcrumb from "../components/Breadcrumb";
import FolderCard from "../components/FolderCard";
import FileCard from "../components/FileCard";
import PdfModal from "../components/PdfModal";

const ROOT = "root"; 

export default function ExplorerPage() {
  const { dataroomId, folderId } = useParams() as { dataroomId: ID; folderId?: ID };
  const currentFolderId = folderId ?? ROOT;

  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["contents", dataroomId, currentFolderId],
    queryFn: () => getFolderContents(dataroomId, currentFolderId),
  });

  const [newFolder, setNewFolder] = useState("");
  const [pdfOpen, setPdfOpen] = useState<{ open: boolean; url?: string }>({ open: false });

  const mCreateFolder = useMutation({
    mutationFn: () => createFolder(dataroomId, newFolder.trim(), currentFolderId === ROOT ? null : currentFolderId),
    onSuccess: () => { setNewFolder(""); qc.invalidateQueries({ queryKey: ["contents", dataroomId, currentFolderId] }); },
  });

  const mUpload = useMutation({
    mutationFn: (file: File) => uploadPdf(dataroomId, currentFolderId, file),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contents", dataroomId, currentFolderId] }),
  });

  const mRenameFolder = useMutation({
    mutationFn: ({ id, name }: { id: ID; name: string }) => renameFolder(id, name),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contents", dataroomId, currentFolderId] }),
  });

  const mRenameFile = useMutation({
    mutationFn: ({ id, name }: { id: ID; name: string }) => renameFile(id, name),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contents", dataroomId, currentFolderId] }),
  });

  const mDelFolder = useMutation({
    mutationFn: (id: ID) => deleteFolder(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contents", dataroomId, currentFolderId] }),
  });

  const mDelFile = useMutation({
    mutationFn: (id: ID) => deleteFile(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contents", dataroomId, currentFolderId] }),
  });

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) mUpload.mutate(f);
    e.currentTarget.value = "";
  };

  return (
    <div className="space-y-6">
      <Breadcrumb dataroomId={dataroomId} folderId={folderId ?? null} />

      <div className="card p-4 flex flex-wrap items-center gap-3">
        <input className="input max-w-xs" placeholder="Nueva carpeta"
          value={newFolder} onChange={(e)=>setNewFolder(e.target.value)} />
        <button className="btn-primary" disabled={!newFolder || mCreateFolder.isPending}
          onClick={()=>mCreateFolder.mutate()}>
          Crear carpeta
        </button>

        <label className="btn-ghost cursor-pointer">
          Subir PDF
          <input type="file" accept="application/pdf" className="hidden" onChange={onPickFile} />
        </label>

        <Link className="ml-auto text-sm text-gray-500 hover:underline" to={`/d/${dataroomId}`}>Ir a raíz</Link>
      </div>

      {isLoading && <div>Cargando...</div>}

      {/* Carpetas */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-600">Carpetas</h3>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {data?.folders.map((f: Folder) => (
            <FolderCard
              key={f.id}
              folder={f}
              dataroomId={dataroomId}
              onRename={(name)=>mRenameFolder.mutate({ id: f.id, name })}
              onDelete={()=>mDelFolder.mutate(f.id)}
            />
          ))}
          {data?.folders.length === 0 && <div className="text-sm text-gray-500">Sin carpetas.</div>}
        </div>
      </section>

      {/* Archivos */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-600">Archivos (PDF)</h3>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {data?.files.map((fi: FileItem) => (
            <FileCard
              key={fi.id}
              item={fi}
              onOpen={()=>setPdfOpen({ open: true, url: fileStreamUrl(fi.id) })}
              onRename={(name)=>mRenameFile.mutate({ id: fi.id, name })}
              onDelete={()=>mDelFile.mutate(fi.id)}
            />
          ))}
          {data?.files.length === 0 && <div className="text-sm text-gray-500">Sin archivos.</div>}
        </div>
      </section>

      <PdfModal open={pdfOpen.open} url={pdfOpen.url || ""} onClose={()=>setPdfOpen({ open: false })} />
    </div>
  );
}
