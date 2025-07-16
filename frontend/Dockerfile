# Frontend Dockerfile (Multi-stage build)
FROM node:23-alpine AS builder

# Arbeitsverzeichnis setzen
WORKDIR /app

# Package.json kopieren und Dependencies installieren
COPY package*.json ./
RUN npm install

# Source Code kopieren und App builden
COPY . .
RUN npm run build

# Production Stage mit Nginx
FROM nginx:alpine

# Build-Dateien von Builder Stage kopieren
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx-Konfiguration für SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Port freigeben
EXPOSE 80

# Nginx starten
CMD ["nginx", "-g", "daemon off;"]
