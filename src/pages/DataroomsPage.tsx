import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createDataroom, listDatarooms } from "../lib/api";
import { Link } from "react-router-dom";

export default function DataroomsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["datarooms"], queryFn: listDatarooms });
  const [name, setName] = useState("");

  const mCreate = useMutation({
    mutationFn: () => createDataroom(name.trim()),
    onSuccess: () => {
      setName("");
      qc.invalidateQueries({ queryKey: ["datarooms"] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="card p-4 flex items-center gap-3">
        <input className="input max-w-sm" placeholder="Nuevo dataroom"
          value={name} onChange={(e)=>setName(e.target.value)} />
        <button className="btn-primary" disabled={!name || mCreate.isPending}
          onClick={()=>mCreate.mutate()}>
          Crear
        </button>
      </div>

      {isLoading && <div>Cargando...</div>}

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {data?.map(dr => (
          <Link key={dr.id} to={`/d/${dr.id}`} className="card p-4 hover:shadow-md">
            <div className="text-lg font-medium">{dr.name}</div>
            <div className="text-xs text-gray-500 mt-1">{dr.id}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
