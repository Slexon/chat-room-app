# Backend Dockerfile
FROM node:23-alpine

# Arbeitsverzeichnis setzen
WORKDIR /app

# Package.json kopieren und Dependencies installieren
COPY package*.json ./
RUN npm install --omit=dev

# Source Code kopieren
COPY . .

# Port freigeben
EXPOSE 3001

# Health Check hinzufügen
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Anwendung starten
CMD ["npm", "start"]
