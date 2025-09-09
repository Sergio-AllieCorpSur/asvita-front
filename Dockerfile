# -------- Build stage --------
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# -------- Runtime stage --------
FROM node:20-alpine AS runner
WORKDIR /app
RUN npm i -g serve@14
COPY --from=builder /app/dist ./dist

ENV PORT=3000
EXPOSE 3000

# Shell form para que $PORT se expanda correctamente
CMD sh -c 'echo "Starting serve on $PORT"; ls -la dist; serve -s dist -l $PORT'