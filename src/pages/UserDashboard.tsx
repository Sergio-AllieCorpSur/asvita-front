import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

type Folder = { id: string; name: string; path: string; parent_id: string | null };
type Dataroom = { id: string; name: string; description?: string };

// Base URLs (mismo patrón que ya usas)
const ORIGIN  = (import.meta.env.VITE_API_URL ?? "https://asvita.onrender.com").trim();
const PREFIX_RAW = (import.meta.env.VITE_API_PREFIX ?? "/api/v1/storage").trim();
const PREFIX = PREFIX_RAW.replace(/https?:\/\/[^/]+/i, "").replace(/\/+$/, "").replace(/^\/?/, "/");
const BASE_STORAGE = new URL(PREFIX, ORIGIN).toString().replace(/\/$/, "");

export default function UserDashboard() {
  const { dataroomId } = useParams<{ dataroomId: string }>();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [drName, setDrName] = useState<string | null>(null);

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

        // (Opcional) Traer detalle del dataroom para mostrar su nombre en el título
        try {
          const drUrl = new URL(`datarooms/${dataroomId}`, BASE_STORAGE + "/").toString();
          const { data } = await axios.get<Dataroom>(drUrl, { signal: ctrl.signal });
          if (data?.name) setDrName(data.name);
        } catch (_) {
          
        }

        
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

  const title = drName ?? dataroomId ?? "Dataroom";

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-medium">{title}  Dashboard</h1>

      {loading && <div className="app-card p-3 text-sm text-gray-500">Loading…</div>}
      {err && <div className="app-card p-3 text-sm text-red-600">Error: {err}</div>}

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

        {/* Lista de folders */}
        <div className="app-card p-4 lg:col-span-8">
          <p className="mb-2 text-sm font-medium">List</p>
          <ul className="space-y-1 text-sm max-h-64 overflow-auto">
            {folders.map((f) => (
              <li key={f.id} className="flex items-center justify-between">
                <span className="font-medium">{f.name}</span>
                <span className="text-xs text-gray-500">{f.path}</span>
              </li>
            ))}
            {!loading && folders.length === 0 && <li className="text-gray-500">Sin folders</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
