# Security Policy

## 🔒 Sicherheitsrichtlinien für Chat Room Application

### ⚠️ WICHTIGE SICHERHEITSREGELN

#### ❌ NIEMALS in Git committen:
- `.env` Dateien mit echten Credentials
- API-Keys oder Passwörter
- Datenbank-Connection-Strings mit echten Daten
- Private Keys oder Zertifikate
- Production-URLs mit sensiblen Parametern

#### ✅ IMMER verwenden:
- `.env.example` als Template
- Environment Variables in der Hosting-Platform
- Generische URLs in Dokumentation
- Placeholder-Werte in Code-Beispielen

### 🛡️ Sichere Konfiguration

#### Environment Variables
```bash
# ✅ RICHTIG - In Hosting-Platform konfigurieren:
DATABASE_URL=postgresql://real_user:real_password@real_host:5432/real_db
NODE_ENV=production

# ❌ FALSCH - Niemals in Code oder Git:
const dbUrl = "postgresql://user:pass123@host.com:5432/db";
```

#### Code-Beispiele
```javascript
// ✅ RICHTIG - Environment Variables verwenden:
const dbUrl = process.env.DATABASE_URL;
const apiKey = process.env.API_KEY;

// ❌ FALSCH - Hardcoded Secrets:
const dbUrl = "postgresql://real_user:real_pass@real_host/db";
const apiKey = "sk-1234567890abcdef";
```

### 🚨 Bei Sicherheitsproblemen

#### Wenn sensible Daten versehentlich committed wurden:

1. **Sofort ändern:**
   ```bash
   # Datei aus Git entfernen
   git rm --cached .env.production
   
   # Commit mit Erklärung
   git commit -m "security: Remove sensitive environment file"
   
   # Änderungen pushen
   git push origin main
   ```

2. **Credentials rotieren:**
   - Datenbank-Passwörter ändern
   - API-Keys neu generieren
   - Neue Environment Variables setzen

3. **Git-History bereinigen (falls nötig):**
   ```bash
   # Für private Repos - komplette History bereinigen
   git filter-branch --force --index-filter \
   'git rm --cached --ignore-unmatch .env.production' \
   --prune-empty --tag-name-filter cat -- --all
   ```

### 📋 Sicherheits-Checkliste

- [ ] Keine `.env` Dateien in Git
- [ ] `.env.example` als Template vorhanden
- [ ] `.gitignore` enthält alle sensiblen Patterns
- [ ] Dokumentation verwendet Placeholder-URLs
- [ ] Code verwendet Environment Variables
- [ ] Production-Credentials nur in Hosting-Platform
- [ ] Debug-Logs enthalten keine sensiblen Daten
- [ ] CORS richtig konfiguriert (nicht `*` in Produktion)
- [ ] Input-Validierung implementiert
- [ ] SSL/TLS in Produktion aktiviert

### 🔍 Regelmäßige Sicherheitsprüfung

#### Monatlich prüfen:
- Git-Log auf versehentlich committed Secrets
- Unused Environment Variables
- Veraltete Dependencies (npm audit)
- CORS-Konfiguration
- SSL-Zertifikate

#### Bei jedem Deploy prüfen:
- Environment Variables korrekt gesetzt
- Debug-Modi deaktiviert
- Logging-Level production-ready
- Fehler-Messages enthalten keine sensiblen Infos

### 📞 Sicherheitsprobleme melden

Bei Sicherheitsproblemen:
1. **NICHT** öffentlich als Issue erstellen
2. Privat melden an Repository-Owner
3. Beschreibung des Problems
4. Steps to reproduce
5. Mögliche Auswirkungen

### 🛠️ Tools für Sicherheit

#### Git-Hooks (empfohlen):
```bash
# Pre-commit Hook zum Erkennen von Secrets
pip install detect-secrets
detect-secrets scan --all-files
```

#### NPM-Sicherheit:
```bash
# Dependencies auf Vulnerabilities prüfen
npm audit
npm audit fix

# Veraltete Packages prüfen
npm outdated
```

---

**Letzte Aktualisierung:** 28. Juli 2025
**Version:** 1.0.0
