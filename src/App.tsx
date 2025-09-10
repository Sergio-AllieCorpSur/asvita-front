import { Outlet, NavLink, Link } from "react-router-dom";
import { useState } from "react";

function NavIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="grid h-9 w-9 place-items-center rounded-lg border bg-white/60 text-gray-600 shadow-sm dark:border-white/10 dark:bg-white/5">
      {children}
    </span>
  );
}

export default function App() {
  const [q, setQ] = useState("");

  return (
    <div className="min-h-dvh bg-[var(--color-bg)] text-[var(--color-fg)] antialiased">
      {/* ======= Topbar ======= */}
      <header className="sticky top-0 z-30 border-b bg-white/70 backdrop-blur dark:border-white/10 dark:bg-black/40">
        <div className="mx-auto max-w-[120rem] px-4">
          <div className="flex h-14 items-center justify-between gap-3">
            {/* Brand */}
            <Link to="/" className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-brand text-xs font-bold text-white shadow-sm">
                SD
              </span>
              <span className="text-[15px] font-semibold tracking-tight">
                Sergio Dataroom
              </span>
              <span className="ml-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium uppercase text-brand">
                MVP
              </span>
            </Link>

            {/* Search */}
            <div className="hidden min-w-[260px] max-w-md flex-1 sm:block">
              <label className="relative block">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Buscar…"
                  className="w-full rounded-lg border bg-white/80 px-3 py-2 pl-9 text-sm shadow-sm outline-none placeholder:text-gray-400 hover:border-gray-300 focus:border-brand focus:ring-4 focus:ring-brand/10 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
                />
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m21 21-4.3-4.3" />
                  <circle cx="11" cy="11" r="7" />
                </svg>
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link to="/new" className="btn-primary px-3 py-1.5">New</Link>
              <button
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-white shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand/50 dark:border-white/10 dark:bg-white/5"
                title="Perfil"
              >
                <span className="h-5 w-5 rounded-full bg-gradient-to-br from-brand to-brand/70" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ======= Body ======= */}
      <div className="mx-auto grid max-w-[120rem] grid-cols-12 px-4">
        {/* Sidebar */}
        <aside className="col-span-12 hidden border-r py-6 pr-4 sm:block md:col-span-2 lg:col-span-2 dark:border-white/10">
          <nav className="space-y-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-xl px-2 py-2 text-sm transition",
                  isActive
                    ? "bg-brand/10 text-brand"
                    : "hover:bg-gray-100 dark:hover:bg-white/10",
                ].join(" ")
              }
            >
              <NavIcon>
                {/* icon dataroom */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="4" width="18" height="14" rx="2" />
                  <path d="M3 8h18" />
                </svg>
              </NavIcon>
              Datarooms
            </NavLink>

            <NavLink
              to="/explorer"
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-xl px-2 py-2 text-sm transition",
                  isActive
                    ? "bg-brand/10 text-brand"
                    : "hover:bg-gray-100 dark:hover:bg-white/10",
                ].join(" ")
              }
            >
              <NavIcon>
                {/* icon explorer */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 12h18M12 3v18" />
                </svg>
              </NavIcon>
              Explorer
            </NavLink>

            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-xl px-2 py-2 text-sm transition",
                  isActive
                    ? "bg-brand/10 text-brand"
                    : "hover:bg-gray-100 dark:hover:bg-white/10",
                ].join(" ")
              }
            >
              <NavIcon>
                {/* icon chart */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 19V7M12 19V5M20 19v-9" />
                </svg>
              </NavIcon>
              Analytics
            </NavLink>

            <NavLink
              to="/users"
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-xl px-2 py-2 text-sm transition",
                  isActive
                    ? "bg-brand/10 text-brand"
                    : "hover:bg-gray-100 dark:hover:bg-white/10",
                ].join(" ")
              }
            >
              <NavIcon>
                {/* icon user */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
                </svg>
              </NavIcon>
              Users
            </NavLink>
          </nav>
        </aside>

        {/* Content */}
        <main className="col-span-12 py-6 md:col-span-10 lg:col-span-10">
          {/* Contenedor “card” */}
          <div className="app-card p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white/70 py-6 text-xs text-gray-500 backdrop-blur dark:border-white/10 dark:bg-black/40">
        <div className="mx-auto max-w-[120rem] px-4">
          <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
            <p>© {new Date().getFullYear()} Sergio Dataroom</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-brand hover:underline">Docs</a>
              <a href="#" className="text-brand hover:underline">Soporte</a>
              <span className="rounded-md border px-2 py-0.5 text-[10px] uppercase tracking-wide">
                v0.1
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
