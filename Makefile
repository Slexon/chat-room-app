# Chat Room Docker Setup

# Build und starte alle Services
.PHONY: up
up:
	docker-compose up --build

# Starte Services im Hintergrund
.PHONY: up-detached
up-detached:
	docker-compose up --build -d

# Stoppe alle Services
.PHONY: down
down:
	docker-compose down

# Stoppe Services und entferne Volumes
.PHONY: down-volumes
down-volumes:
	docker-compose down -v

# Baue alle Images neu
.PHONY: build
build:
	docker-compose build --no-cache

# Zeige Logs aller Services
.PHONY: logs
logs:
	docker-compose logs -f

# Zeige nur Backend-Logs
.PHONY: logs-backend
logs-backend:
	docker-compose logs -f backend

# Zeige nur Frontend-Logs
.PHONY: logs-frontend
logs-frontend:
	docker-compose logs -f frontend

# Bereinige Docker (entferne ungenutzte Images/Container)
.PHONY: clean
clean:
	docker system prune -f

# Zeige Status aller Services
.PHONY: status
status:
	docker-compose ps

# Restart aller Services
.PHONY: restart
restart:
	docker-compose restart
