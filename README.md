ACIL Storage UI

Interfaz web (React + Vite + TypeScript) para explorar Datarooms, Folders y Files, con carga por drag & drop, previsualización de PDFs y acciones básicas (listar, abrir, eliminar).

Frontend: React + Vite + TypeScript

Estilos: utilitarios (clases tipo Tailwind)

Backend: API de storage (datarooms/folders/files)

Despliegue: Render con Docker

📁 Estructura principal
.
├─ public/
├─ src/
│  ├─ components/
│  │  ├─ Breadcrumb.tsx
│  │  ├─ FileCard.tsx
│  │  ├─ FolderCard.tsx
│  │  ├─ InlineEdit.tsx
│  │  ├─ PdfModal.tsx
│  │  └─ datarooom.tsx
│  ├─ lib/
│  │  └─ api.ts
│  ├─ pages/
│  │  ├─ Dashboard.tsx
│  │  ├─ DataroomsPage.tsx
│  │  ├─ DropZoneUpload.tsx   ← drag & drop + POST /files
│  │  ├─ ExplorerPage.tsx
│  │  └─ UserDashboard.tsx    ← vista tipo “Drive” (folders expandibles + files)
│  ├─ App.tsx / App.css / index.css / main.tsx
│  └─ types.ts
└─ Dockerfile (ver abajo)

🔌 Variables de entorno

El front se configura vía variables VITE_*:

Variable	Ejemplo/Default	Descripción
VITE_API_URL	https://asvita.onrender.com	Origen del backend
VITE_API_PREFIX	/api/v1/storage	Prefijo de la API de storage

Crea un archivo .env (local) o variables en Render:

VITE_API_URL=https://asvita.onrender.com
VITE_API_PREFIX=/api/v1/storage


En el código, la URL base final se resuelve como new URL(VITE_API_PREFIX, VITE_API_URL).

🧭 Rutas y comportamiento

Datarooms: lista y detalle.

UserDashboard: lista folders del dataroom, permite expandir cada folder y cargar/abrir/borrar archivos.

DropZoneUpload: drag & drop que hace POST /datarooms/{d}/folders/{f}/files.

Endpoints usados (ejemplos):

GET /api/v1/storage/datarooms/{dataroom_id}/folders

GET /api/v1/storage/folders/{folder_id}/files

GET /api/v1/storage/files/{file_id} (stream PDF)

POST /api/v1/storage/datarooms/{dataroom_id}/folders/{folder_id}/files (multipart)

DELETE /api/v1/storage/files/{file_id}

▶️ Desarrollo local

Requisitos: Node 18+ / pnpm o npm.

# instalar dependencias
npm install

# servidor dev (Vite)
npm run dev

# build producción (genera dist/)
npm run build

# preview local de producción
npm run preview

🐳 Docker (producción)

Dockerfile de dos etapas: build y static server con serve (respeta $PORT, ideal para Render).

# --- build ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- run ---
FROM node:20-alpine AS runtime
WORKDIR /app
RUN npm i -g serve
COPY --from=build /app/dist ./dist
ENV PORT=8080
EXPOSE 8080
CMD ["serve", "-s", "dist", "-l", "$PORT"]

Correr local con Docker
docker build -t acil-storage-ui .
docker run -p 8080:8080 --env-file .env acil-storage-ui


Si no usas .env, puedes pasar -e VITE_API_URL=... -e VITE_API_PREFIX=....

🚀 Despliegue en Render (Docker)

New → Web Service → Build from repo y selecciona tu repo.

Runtime: Docker. Render detectará tu Dockerfile.

Environment variables:

VITE_API_URL, VITE_API_PREFIX (como en local).

Ports: Render inyecta $PORT; el contenedor ya lo respeta (serve -l $PORT).

Deploy.

Alternativa: Render Static Site (sin Docker) usando Build Command: npm run build y Publish Directory: dist. Pero con Docker ya está resuelto.

🧩 Fragmentos clave
Drag & Drop upload (resumen)
// DropZoneUpload.tsx (extracto)
const form = new FormData();
form.append("file", file);
form.append("name", file.name);

await axios.post(
  `${BASE}/datarooms/${dataroomId}/folders/${folderId}/files`,
  form,
  { onUploadProgress: ... }
);

onUploaded(); // refrescar lista de files

Lista tipo Drive + abrir/borrar
<a
  href={`${BASE}/files/${file.id}`}
  target="_blank"
  rel="noreferrer"
  className="text-blue-600 hover:underline"
>
  Abrir
</a>

<button
  onClick={() => deleteFile(file.id, f.id)}
  className="text-red-600 hover:underline"
>
  Eliminar
</button>

✅ UX y Accesibilidad

Carga perezosa de files por folder (caché en memoria).

Progreso de subida y confirmación de éxito.

Estado “Borrando…” mientras se elimina.

aria-expanded y aria-controls en los toggles de folder.

🔧 Troubleshooting

404 al refrescar ruta: serve -s ya hace history fallback.

CORS: asegúrate de habilitarlo en el backend para el origen del front.

Uploads fallan: verifica Content-Type no se fuerce; con FormData lo maneja el navegador.

📝 Scripts útiles
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview --port 8080"
  }
}

📄 Licencia

Este proyecto se distribuye bajo la licencia que defina tu organización (por ejemplo, MIT). Actualiza esta sección según corresponda.

¿Quieres que genere también un badge de Render y un README en inglés?

Tú dijiste:
en ingles
ChatGPT Plus
Pensó durante 13s
ACIL Storage UI

A React (Vite + TypeScript) web interface to explore Datarooms, Folders, and Files with Drive-like expand/collapse, drag-and-drop uploads, PDF preview/open, and delete actions.

Frontend: React + Vite + TypeScript

Styling: utility classes (Tailwind-like)

Backend: Storage API (/datarooms, /folders, /files)

Deployment: Render via Docker

Features

List datarooms and folders

Expand/collapse folders (lazy load files per folder)

Drag & drop upload to a specific folder (multipart/form-data)

Open file (PDF stream) and delete file

Per-folder loading/error states, upload progress, and success confirmation

Project Structure (relevant)
.
├─ public/
├─ src/
│  ├─ components/
│  │  ├─ Breadcrumb.tsx
│  │  ├─ FileCard.tsx
│  │  ├─ FolderCard.tsx
│  │  ├─ InlineEdit.tsx
│  │  ├─ PdfModal.tsx
│  │  └─ datarooom.tsx
│  ├─ lib/
│  │  └─ api.ts
│  ├─ pages/
│  │  ├─ Dashboard.tsx
│  │  ├─ DataroomsPage.tsx
│  │  ├─ DropZoneUpload.tsx   ← drag & drop + POST /files
│  │  ├─ ExplorerPage.tsx
│  │  └─ UserDashboard.tsx    ← Drive-like view (expand folders + files)
│  ├─ App.tsx / App.css / index.css / main.tsx
│  └─ types.ts
└─ Dockerfile

Environment Variables

The frontend is configured via VITE_* variables:

Variable	Example / Default	Purpose
VITE_API_URL	https://asvita.onrender.com	Backend origin
VITE_API_PREFIX	/api/v1/storage	Storage API base path

Create a local .env (or set env vars in Render):

VITE_API_URL=https://asvita.onrender.com
VITE_API_PREFIX=/api/v1/storage


The app computes the base URL internally as:
new URL(VITE_API_PREFIX, VITE_API_URL).

API Endpoints Used (examples)

GET /api/v1/storage/datarooms/{dataroom_id}/folders

GET /api/v1/storage/folders/{folder_id}/files

GET /api/v1/storage/files/{file_id} (PDF stream)

POST /api/v1/storage/datarooms/{dataroom_id}/folders/{folder_id}/files (multipart)

DELETE /api/v1/storage/files/{file_id}

Run Locally

Requirements: Node 18+ (npm or pnpm)

# install dependencies
npm install

# dev server (Vite)
npm run dev

# production build (outputs dist/)
npm run build

# preview production build locally
npm run preview

Docker (Production)

Multi-stage Dockerfile: build with Node, serve static build with serve (honors $PORT, ideal for Render).

# --- build stage ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- runtime stage ---
FROM node:20-alpine AS runtime
WORKDIR /app
RUN npm i -g serve
COPY --from=build /app/dist ./dist
ENV PORT=8080
EXPOSE 8080
CMD ["serve", "-s", "dist", "-l", "$PORT"]

Run with Docker locally
docker build -t acil-storage-ui .
docker run -p 8080:8080 --env-file .env acil-storage-ui


Without .env, pass -e VITE_API_URL=... -e VITE_API_PREFIX=....

Deploy on Render (Docker)

New → Web Service → Build from repo, select your repository.

Runtime: Docker (Render auto-detects Dockerfile).

Environment variables: set VITE_API_URL, VITE_API_PREFIX.

Port: Render injects $PORT; the image serves dist via serve -l $PORT.

Deploy.

Alternative (no Docker): Render Static Site with Build Command: npm run build and Publish Directory: dist.

Key UI Snippets
Drag & Drop Upload (DropZoneUpload)
const form = new FormData();
form.append("file", file);
form.append("name", file.name);

await axios.post(
  `${BASE}/datarooms/${dataroomId}/folders/${folderId}/files`,
  form,
  { onUploadProgress: e => setProgress(Math.round((e.loaded * 100) / (e.total || 1))) }
);

setSuccess(`"${file.name}" uploaded successfully ✅`);
onUploaded(); // refresh file list

Open / Delete a File
<a
  href={`${BASE}/files/${file.id}`}
  target="_blank"
  rel="noreferrer"
  className="text-blue-600 hover:underline"
>
  Open
</a>

<button
  onClick={() => deleteFile(file.id, folderId)}
  className="text-red-600 hover:underline"
>
  Delete
</button>

UX & Accessibility

Lazy loading of files per folder (cached in memory)

Upload progress + success confirmation; “Deleting…” state while removing a file

aria-expanded / aria-controls on folder toggles

Keyboard-accessible dropzone (click to open file picker)

Troubleshooting

404 on refresh (client routes): the Docker serve -s dist uses SPA history fallback.

CORS errors: allow the frontend origin in the backend CORS policy.

Uploads fail: don’t set Content-Type manually with FormData (browser sets boundary).

List not refreshing after upload: invalidate the folder cache before re-fetching.

NPM Scripts
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview --port 8080"
  }
}
