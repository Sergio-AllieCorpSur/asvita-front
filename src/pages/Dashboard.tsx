import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

type Dataroom = { id: string; name: string; description?: string };

const ORIGIN  = (import.meta.env.VITE_API_URL ?? "https://asvita.onrender.com").replace(/\/+$/, "");
const PREFIX  = (import.meta.env.VITE_API_PREFIX ?? "/api/v1/storage")
  .replace(/\/+$/,"")  
  .replace(/^\/?/, "/"); 
const BASE = `${ORIGIN}${PREFIX}`; 
const DATAROOMS_URL = `${BASE}/datarooms`;



export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [kpi, setKpi] = useState({ datarooms: 0, folders: 0, files: 0 });
  const [list, setList] = useState<Dataroom[]>([]);

  useEffect(() => {
    const ctrl = new AbortController();
    console.log({ ORIGIN, PREFIX, BASE, DATAROOMS_URL });

    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const res = await axios.get<Dataroom[]>(DATAROOMS_URL, { signal: ctrl.signal });

        const data = Array.isArray(res.data) ? res.data : [];
        setList(data);
        setKpi((k) => ({ ...k, datarooms: data.length }));
      }
      catch (e: any) {
        if (e.name === "CanceledError") return; 
        console.error("Fetch error:", e?.response || e);
        setErr(e?.response ? `HTTP ${e.response.status}` : e?.message || "Network Error");
      } finally {
        setLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-medium">Mannager Dashboard</h1>
      {loading && <div className="app-card p-3 text-sm text-gray-500">Loading…</div>}
      {err && <div className="app-card p-3 text-sm text-red-600">Error: {err}</div>}

      <div className="grid gap-4 lg:grid-cols-12 items-start">
        <div className="app-card p-4 lg:col-span-4">
          <p className="text-xs text-gray-500">Datarooms</p>
          <div className="mt-4 grid place-items-center">
            <div className="grid h-28 w-28 place-items-center rounded-full border-8">
              <span className="text-2xl font-semibold">{kpi.datarooms}</span>
            </div>
            <p className="mt-2 text-xs text-gray-500">total</p>
          </div>
        </div>
      

      <div className="app-card p-4 lg:col-span-8">
          <p className="mb-2 text-sm font-medium">List</p>
          <ul className="space-y-1 text-sm max-h-64 overflow-auto">
            {list.map((dr) => (
              <li key={dr.id}>
                <Link
                  to={`/userdashboard/${dr.id}?name=${encodeURIComponent(dr.name)}`}
                  className="flex items-center justify-between p-2 rounded hover:bg-gray-100 transition"
                >
                  <span className="font-medium">{dr.name}</span>
                  <span className="text-xs text-gray-500">{dr.id}</span>
                </Link>
              </li>
            ))}
            {!loading && list.length === 0 && (
              <li className="text-gray-500">Sin datarooms</li>
            )}
          </ul>
      </div>
    
    
      
        <div className="space-y-6">       
      </div>
      </div>
    </div>
  );
}
