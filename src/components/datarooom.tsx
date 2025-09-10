import { useState } from "react";
import axios from "axios";


const ORIGIN = (import.meta.env.VITE_API_URL ?? "https://asvita.onrender.com").trim();
const PREFIX_RAW = (import.meta.env.VITE_API_PREFIX ?? "/api/v1/storage").trim();
const PREFIX = PREFIX_RAW
  .replace(/https?:\/\/[^/]+/i, "") 
  .replace(/\/+$/, "")               
  .replace(/^\/?/, "/");             
const BASE = new URL(PREFIX, ORIGIN).toString().replace(/\/$/, "");
const DATAROOMS_URL = new URL("datarooms", BASE + "/").toString();

type Dataroom = { id: string; name: string; description?: string };


interface Props {
  onCreated?: (dr: Dataroom) => void;
}

export default function NewDataroomForm({ onCreated }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
    
    

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setOk(null);

    if (!name.trim()) {
      setErr("El nombre es obligatorio.");
      return;
    }
    if (name.length > 120) {
      setErr("El nombre no debe superar 120 caracteres.");
      return;
    }

    try {
      setLoading(true);
      const payload = { name: name.trim(), description: description.trim() || undefined };
      const { data } = await axios.post<Dataroom>(DATAROOMS_URL, payload, {
        headers: { "Content-Type": "application/json" },
      });

      setOk("Dataroom creado correctamente.");
      setName("");
      setDescription("");
      onCreated?.(data);
    } catch (e: any) {
      // Mapea errores comunes del backend
      if (e.response?.status === 409) setErr("Ya existe un dataroom con ese nombre.");
      else if (e.response?.data?.error) setErr(e.response.data.error);
      else setErr(e.message || "Error al crear el dataroom.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="app-card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium">Nuevo dataroom</h2>
        <span className="text-xs text-gray-500">
            {new URL(DATAROOMS_URL).pathname}
        </span>
      </div>

      {err && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div>}
      {ok &&  <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{ok}</div>}

      <div className="grid gap-4 md:grid-cols-2">
        {/* Nombre */}
        <div className="md:col-span-1">
          <label htmlFor="dr-name" className="block text-sm font-medium">
            Nombre <span className="text-red-600">*</span>
          </label>
          <input
            id="dr-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Legal Room"
            className="mt-1 w-full rounded-lg border bg-white/80 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400
                       focus:border-brand focus:ring-4 focus:ring-brand/10"
            maxLength={120}
            required
          />
          <p className="mt-1 text-xs text-gray-500">Obligatorio. Máx. 120 caracteres.</p>
        </div>

        {/* Descripción */}
        <div className="md:col-span-1">
          <label htmlFor="dr-desc" className="block text-sm font-medium">
            Descripción
          </label>
          <textarea
            id="dr-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción breve (opcional)"
            className="mt-1 h-[84px] w-full resize-y rounded-lg border bg-white/80 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400
                       focus:border-brand focus:ring-4 focus:ring-brand/10"
            maxLength={400}
          />
          <p className="mt-1 text-xs text-gray-500">Opcional. Máx. 400 caracteres.</p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => { setName(""); setDescription(""); setErr(null); setOk(null); }}
          className="btn-soft px-3 py-2"
          disabled={loading}
        >
          Limpiar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary px-4 py-2 disabled:opacity-60"
        >
          {loading ? "Creando…" : "Crear dataroom"}
        </button>
      </div>
    </form>
  );
}
