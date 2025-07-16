# Chat Room Application - Docker Setup

Eine vollständig containerisierte Chat-Room-Anwendung mit React Frontend und Node.js Backend.

## 🐳 Docker-Architektur

- **Frontend**: React-App mit Nginx (Multi-stage Build)
- **Backend**: Node.js Express Server mit Socket.IO
- **Netzwerk**: Isolierte Docker-Bridge für Service-Kommunikation

## 📋 Voraussetzungen

- Docker Desktop (Windows/Mac/Linux)
- Docker Compose V2

## 🚀 Schnellstart

### 1. Anwendung starten

```powershell
# Alle Services builden und starten
docker-compose up --build

# Im Hintergrund starten
docker-compose up --build -d
```

### 2. Zugriff auf die Anwendung

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

### 3. Anwendung stoppen

```powershell
# Services stoppen
docker-compose down

# Services stoppen und Volumes entfernen
docker-compose down -v
```

## 🛠️ Entwicklung

### Logs anzeigen

```powershell
# Alle Service-Logs
docker-compose logs -f

# Nur Backend-Logs
docker-compose logs -f backend

# Nur Frontend-Logs
docker-compose logs -f frontend
```

### Services einzeln neustarten

```powershell
# Backend neustarten
docker-compose restart backend

# Frontend neustarten
docker-compose restart frontend
```

### In Container einsteigen

```powershell
# Backend Container
docker-compose exec backend sh

# Frontend Container (Nginx)
docker-compose exec frontend sh
```

## 🔧 Konfiguration

### Umgebungsvariablen

Erstellen Sie eine `.env`-Datei im Root-Verzeichnis:

```env
# Backend
NODE_ENV=production
PORT=3001

# Frontend Build-Zeit Variablen
VITE_BACKEND_URL=http://localhost:3001
```

### Ports anpassen

Bearbeiten Sie `docker-compose.yml`:

```yaml
services:
  frontend:
    ports:
      - "8080:80"  # Frontend auf Port 8080
  backend:
    ports:
      - "3000:3001"  # Backend auf Port 3000
```

## 📂 Docker-Dateien Übersicht

```
.
├── docker-compose.yml      # Service-Orchestrierung
├── .dockerignore          # Global Docker-Ignore
├── backend/
│   ├── Dockerfile         # Backend Container-Definition
│   └── .dockerignore      # Backend-spezifische Ignores
└── frontend/
    ├── Dockerfile         # Frontend Multi-stage Build
    ├── nginx.conf         # Nginx-Konfiguration
    └── .dockerignore      # Frontend-spezifische Ignores
```

## 🧪 Health Checks

Das Backend verfügt über einen Health-Check-Endpoint:

```bash
curl http://localhost:3001/health
```

Antwort:
```json
{
  "status": "OK",
  "timestamp": "2025-07-16T10:30:00.000Z"
}
```

## 🚚 Deployment

### Produktions-Build

```powershell
# Images für Produktion builden
docker-compose -f docker-compose.yml build --no-cache

# Mit spezifischer Umgebung
docker-compose -f docker-compose.prod.yml up -d
```

### Registry Push (optional)

```powershell
# Images taggen
docker tag chat-room_backend:latest your-registry/chat-room-backend:v1.0.0
docker tag chat-room_frontend:latest your-registry/chat-room-frontend:v1.0.0

# Push zu Registry
docker push your-registry/chat-room-backend:v1.0.0
docker push your-registry/chat-room-frontend:v1.0.0
```

## 🔍 Troubleshooting

### Container Status prüfen

```powershell
docker-compose ps
```

### Logs bei Problemen

```powershell
# Detaillierte Logs
docker-compose logs --tail=100 backend
docker-compose logs --tail=100 frontend
```

### Netzwerk-Konnektivität testen

```powershell
# Vom Frontend-Container zum Backend
docker-compose exec frontend ping backend

# Port-Verfügbarkeit prüfen
docker-compose exec backend netstat -tulpn
```

### Container-Ressourcen überwachen

```powershell
# Ressourcen-Nutzung anzeigen
docker stats
```

## 🧹 Wartung

### Docker-System bereinigen

```powershell
# Ungenutzte Images/Container entfernen
docker system prune -f

# Alle ungenutzten Volumes entfernen
docker volume prune -f

# Komplette Bereinigung (Vorsicht!)
docker system prune -a --volumes
```

### Images aktualisieren

```powershell
# Base Images aktualisieren
docker-compose pull
docker-compose up --build
```

## 📊 Performance-Optimierung

### Build-Cache nutzen

```powershell
# Mit Build-Cache (Standard)
docker-compose build

# Ohne Cache (bei Problemen)
docker-compose build --no-cache
```

### Multi-Stage Build (Frontend)

Das Frontend verwendet einen optimierten Multi-Stage Build:
1. **Builder-Stage**: Installiert Dependencies und baut die App
2. **Production-Stage**: Nginx mit nur den Build-Artefakten

Dies reduziert die finale Image-Größe erheblich.

## 🔐 Sicherheit

- Nginx läuft als Non-Root User
- Unnötige Dependencies werden nicht in Produktions-Images installiert
- Health Checks für Container-Monitoring
- Isolierte Docker-Netzwerke

## 📈 Monitoring

Für erweiterte Überwachung können Sie zusätzliche Services hinzufügen:

```yaml
# In docker-compose.yml
services:
  # ... bestehende Services
  
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    # ... weitere Konfiguration
```
