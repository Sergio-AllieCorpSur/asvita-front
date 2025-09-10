export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Fila 1: KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="app-card p-4">
          <p className="text-xs text-gray-500">Group Members Online</p>
          <div className="mt-4 grid place-items-center">
            <div className="grid h-28 w-28 place-items-center rounded-full border-8">
              <span className="text-2xl font-semibold">1</span>
            </div>
            <p className="mt-2 text-xs text-gray-500">total</p>
          </div>
        </div>

        <div className="app-card p-4">
          <p className="text-xs text-gray-500">User Activity History</p>
          <div className="mt-4 h-24 rounded-lg border bg-white/60 dark:bg-white/5" />
          <p className="mt-3 text-xs text-gray-500">Who viewed, printed, descargó…</p>
        </div>

        <div className="app-card p-4">
          <p className="text-xs text-gray-500">Users History</p>
          <div className="mt-4 h-24 rounded-lg border bg-white/60 dark:bg-white/5" />
          <p className="mt-3 text-xs text-gray-500">Quién creó o editó usuarios…</p>
        </div>

        <div className="app-card p-4">
          <p className="text-xs text-gray-500">Top 5</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex items-center justify-between">
              <span>Administrators</span>
              <span className="rounded-md bg-brand/10 px-2 py-0.5 text-brand">1</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Guests</span>
              <span className="rounded-md bg-gray-100 px-2 py-0.5 text-gray-600 dark:bg-white/10 dark:text-gray-300">0</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Fila 2: tarjetas anchas tipo “history” */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="app-card p-4">
          <p className="text-sm font-medium">Project History</p>
          <p className="text-xs text-gray-500">Quién cambió configuraciones y cuándo.</p>
          <div className="mt-4 h-32 rounded-lg border bg-white/60 dark:bg-white/5" />
        </div>

        <div className="app-card p-4">
          <p className="text-sm font-medium">Groups History</p>
          <p className="text-xs text-gray-500">Creación y edición de grupos.</p>
          <div className="mt-4 h-32 rounded-lg border bg-white/60 dark:bg白/5" />
        </div>
      </div>

      {/* Fila 3: una tarjeta larga */}
      <div className="app-card p-4">
        <p className="text-sm font-medium">User Login History</p>
        <p className="text-xs text-gray-500">Usuarios que iniciaron sesión y momento.</p>
        <div className="mt-4 h-40 rounded-lg border bg-white/60 dark:bg-white/5" />
      </div>
    </div>
  );
}
