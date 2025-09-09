# -------- Build stage --------
FROM node:20-alpine AS builder
WORKDIR /app

# Instalar dependencias con cache eficiente
COPY package*.json ./
# Si usas pnpm o yarn, ajusta estas líneas
RUN npm ci

# Copiar el resto del código y compilar
COPY . .
# Asegúrate de que "build" exista en package.json (Vite): "vite build"
RUN npm run build

# -------- Runtime stage --------
FROM node:20-alpine AS runner
WORKDIR /app

# Instalar un servidor estático que respete $PORT
RUN npm i -g serve@14

# Copiar artefactos construidos
COPY --from=builder /app/dist ./dist

# (Opcional para tests locales) Puerto por defecto
ENV PORT=3000
EXPOSE 3000

# Render establecerá $PORT; este comando lo respeta
CMD ["serve", "-s", "dist", "-l", "tcp://0.0.0.0:${PORT}"]
