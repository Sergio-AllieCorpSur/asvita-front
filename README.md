# ACIL Storage UI

Interfaz web (**React + Vite + TypeScript**) para explorar **Datarooms**, **Folders** y **Files**, con carga por *drag & drop*, previsualización de PDFs y acciones básicas (listar, abrir, eliminar).

- **Frontend:** React + Vite + TypeScript  
- **Estilos:** utilitarios (clases tipo Tailwind)  
- **Backend:** API de storage (datarooms/folders/files)  
- **Despliegue:** Render con Docker

---

## 📁 Estructura principal

├─ public/
├─ src/
│ ├─ components/
│ │ ├─ Breadcrumb.tsx
│ │ ├─ FileCard.tsx
│ │ ├─ FolderCard.tsx
│ │ ├─ InlineEdit.tsx
│ │ ├─ PdfModal.tsx
│ │ └─ datarooom.tsx
│ ├─ lib/
│ │ └─ api.ts
│ ├─ pages/
│ │ ├─ Dashboard.tsx
│ │ ├─ DataroomsPage.tsx
│ │ ├─ DropZoneUpload.tsx ← drag & drop + POST /files
│ │ ├─ ExplorerPage.tsx
│ │ └─ UserDashboard.tsx ← vista tipo “Drive” (folders expandibles + files)
│ ├─ App.tsx / App.css / index.css / main.tsx
│ └─ types.ts
└─ Dockerfile


---

## 🔌 Variables de entorno

El frontend se configura vía variables `VITE_*`:

| Variable         | Ejemplo/Default                 | Descripción                      |
|------------------|---------------------------------|----------------------------------|
| `VITE_API_URL`   | `https://asvita.onrender.com`   | Origen del backend               |
| `VITE_API_PREFIX`| `/api/v1/storage`               | Prefijo de la API de storage     |

Crea un archivo **`.env`** (local) o variables en Render:

```env
VITE_API_URL=https://asvita.onrender.com
VITE_API_PREFIX=/api/v1/storage


La URL base final se resuelve como: new URL(VITE_API_PREFIX, VITE_API_URL).

🧭 Rutas y comportamiento

Datarooms: lista y detalle.

UserDashboard: lista folders del dataroom; permite expandir cada folder y cargar/abrir/borrar archivos.

DropZoneUpload: drag & drop que hace POST /datarooms/{d}/folders/{f}/files.

Endpoints usados (ejemplos):

GET    /api/v1/storage/datarooms/{dataroom_id}/folders
GET    /api/v1/storage/folders/{folder_id}/files
GET    /api/v1/storage/files/{file_id}               ; stream PDF
POST   /api/v1/storage/datarooms/{d}/folders/{f}/files ; multipart
DELETE /api/v1/storage/files/{file_id}


▶️ Desarrollo local

Requisitos: Node 18+ (npm o pnpm)

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

docker build -t acil-storage-ui .
docker run -p 8080:8080 --env-file .env acil-storage-ui

Si no usas .env, puedes pasar -e VITE_API_URL=... -e VITE_API_PREFIX=....

🚀 Despliegue en Render (Docker)

New → Web Service → Build from repo y selecciona tu repo.

Runtime: Docker (Render detecta el Dockerfile).

Environment variables: VITE_API_URL, VITE_API_PREFIX.

Ports: Render inyecta $PORT; el contenedor lo respeta (serve -l $PORT).

Deploy.

Alternativa (sin Docker): Render Static Site con Build Command: npm run build y Publish Directory: dist.

🧩 Fragmentos clave

