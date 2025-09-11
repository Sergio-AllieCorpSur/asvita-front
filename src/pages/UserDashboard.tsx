import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DropZoneUpload from "./DropZoneUpload";

type Folder = { id: string; name: string; path: string; parent_id: string | null };
type Dataroom = { id: string; name: string; description?: string };
type FileItem = {
  id: string;
  name: string;
  original_filename: string;
  size_bytes: number;
  content_type: string;
  version: number;
};

const ORIGIN = (import.meta.env.VITE_API_URL ?? "https://asvita.onrender.com").trim();
const PREFIX_RAW = (import.meta.env.VITE_API_PREFIX ?? "/api/v1/storage").trim();
const PREFIX = PREFIX_RAW.replace(/https?:\/\/[^/]+/i, "").replace(/\/+$/, "").replace(/^\/?/, "/");
const BASE_STORAGE = new URL(PREFIX, ORIGIN).toString().replace(/\/$/, "");

export default function UserDashboard() {
  const { dataroomId } = useParams<{ dataroomId: string }>();

  // estado general
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [drName, setDrName] = useState<string | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);

  // estado “Drive-like”
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());
  const [filesByFolder, setFilesByFolder] = useState<Record<string, FileItem[]>>({});
  const [loadingFolder, setLoadingFolder] = useState<Record<string, boolean>>({});
  const [errorFolder, setErrorFolder] = useState<Record<string, string | null>>({});

  // carga dataroom + folders
  useEffect(() => {
    if (!dataroomId) {
      setErr("Falta dataroomId en la URL");
      setLoading(false);
      return;
    }
    const ctrl = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setErr(null);

        // nombre del dataroom (best-effort)
        try {
          const drUrl = new URL(`datarooms/${dataroomId}`, BASE_STORAGE + "/").toString();
          const { data } = await axios.get<Dataroom>(drUrl, { signal: ctrl.signal });
          if (data?.name) setDrName(data.name);
        } catch {
          /* no fatal */
        }

        // folders del dataroom
        const foldersUrl = new URL(`datarooms/${dataroomId}/folders`, BASE_STORAGE + "/").toString();
        const res = await axios.get<Folder[]>(foldersUrl, { signal: ctrl.signal });
        setFolders(Array.isArray(res.data) ? res.data : []);
      } catch (e: any) {
        if (e.name !== "CanceledError") {
          console.error("Fetch error:", e?.response || e);
          setErr(e?.response ? `HTTP ${e.response.status}` : e?.message || "Network Error");
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, [dataroomId]);

  // fetch de files por folder (lazy + cache)
  const fetchFilesForFolder = async (folderId: string) => {
    if (filesByFolder[folderId]) return; // ya cacheado

    try {
      setLoadingFolder((s) => ({ ...s, [folderId]: true }));
      setErrorFolder((s) => ({ ...s, [folderId]: null }));

      const url = new URL(`folders/${folderId}/files`, BASE_STORAGE + "/").toString();
      const { data } = await axios.get<FileItem[]>(url);

      setFilesByFolder((s) => ({ ...s, [folderId]: Array.isArray(data) ? data : [] }));
    } catch (e: any) {
      setErrorFolder((s) => ({
        ...s,
        [folderId]: e?.response ? `HTTP ${e.response.status}` : e?.message || "Network Error",
      }));
    } finally {
      setLoadingFolder((s) => ({ ...s, [folderId]: false }));
    }
  };

  // abre/cierra folder y dispara fetch si abre
  const toggleFolder = async (folderId: string) => {
    const next = new Set(openFolders);
    if (next.has(folderId)) {
      next.delete(folderId);
    } else {
      next.add(folderId);
      await fetchFilesForFolder(folderId);
    }
    setOpenFolders(next);
  };

  const title = drName ?? dataroomId ?? "Dataroom";

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-medium">{title} Dashboard</h1>

      {loading && <div className="app-card p-3 text-sm text-gray-500">Loading…</div>}
      {err && <div className="app-card p-3 text-sm text-red-600">Error: {err}</div>}

      {!loading && !err && (
        <div className="grid gap-4 lg:grid-cols-12 items-start">
          {/* KPI: total folders */}
          <div className="app-card p-4 lg:col-span-4">
            <p className="text-xs text-gray-500">Folders</p>
            <div className="mt-4 grid place-items-center">
              <div className="grid h-28 w-28 place-items-center rounded-full border-8">
                <span className="text-2xl font-semibold">{folders.length}</span>
              </div>
              <p className="mt-2 text-xs text-gray-500">total</p>
            </div>
          </div>

          {/* Lista estilo Drive */}
          <div className="app-card p-4 lg:col-span-8">
            <p className="mb-2 text-sm font-medium">List</p>

            <ul className="space-y-1 text-sm max-h-96 overflow-auto">
              {folders.map((f) => {
                const isOpen = openFolders.has(f.id);
                const isLoading = !!loadingFolder[f.id];
                const fErr = errorFolder[f.id];
                const files = filesByFolder[f.id] || [];

                return (
                  <li key={f.id} className="rounded">
                    {/* Fila del folder */}
                    <button
                      onClick={() => toggleFolder(f.id)}
                      className="w-full flex items-center justify-between p-2 rounded hover:bg-gray-100 transition text-left"
                      aria-expanded={isOpen}
                      aria-controls={`files-${f.id}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`inline-block transition-transform ${isOpen ? "rotate-90" : ""}`}>
                          ▶
                        </span>
                        <span className="font-medium">{f.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">{f.path}</span>
                    </button>

                    {/* Contenido expandible */}
                    {isOpen && (
                      <div id={`files-${f.id}`} className="ml-6 pl-4 border-l">
                        {isLoading && <div className="py-2 text-xs text-gray-500">Cargando archivos…</div>}
                        {fErr && <div className="py-2 text-xs text-red-600">Error: {fErr}</div>}

                        {!isLoading && !fErr && (
                          <>
                            {files.length === 0 ? (
                              <div className="py-2 text-xs text-gray-500">Sin archivos</div>
                            ) : (
                              <ul className="py-1 space-y-1">
                                {files.map((file) => (
                                  <li
                                    key={file.id}
                                    className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span>📄</span>
                                      <span className="truncate">{file.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                      <span>{(file.size_bytes / 1024).toFixed(1)} KB</span>
                                      <a
                                        href={new URL(`files/${file.id}`, BASE_STORAGE + "/").toString()}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 hover:underline"
                                        title="Abrir"
                                      >
                                        Abrir
                                      </a>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            )}
                            <DropZoneUpload
                              dataroomId={dataroomId!}
                              folderId={f.id}
                              baseStorageUrl={BASE_STORAGE}
                              onUploaded={() => {
                                // refresca solo este folder (re-usa tu función existente):
                                // Si tienes fetchFilesForFolder(folderId), úsala:
                                fetchFilesForFolder(f.id);
                              }}
                            />
                          </>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}

              {folders.length === 0 && <li className="text-gray-500">Sin folders</li>}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
