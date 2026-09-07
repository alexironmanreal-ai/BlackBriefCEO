# BlackBriefCEO

**Briefing ejecutivo de amenazas anclado al dossier del cliente — no a internet.**

Cada mañana el CEO no necesita otro recorte de prensa. Necesita saber qué, de todo lo que se mueve, toca *sus* activos, *su* gente, *sus* contratos y *su* geografía.

## Qué es

1. **Dossier** — identidad, activos, personas, supply chain, exposiciones.
2. **Briefing** — 4–6 amenazas mapeadas a anclas del dossier.
3. **Archivo** — historial por fecha.
4. **Cuenta empresa** — login/registro; memoria en base de datos por usuario.

## Arranque (web)

```bash
npm install
npm run dev
```

http://localhost:8080 — generación en vivo requiere `XAI_API_KEY` en el servidor.

### Login de empresa

| Ruta | Uso |
|------|-----|
| `/registro` | Alta email + contraseña |
| `/login` | Acceso y carga de memoria desde DB |
| `/dossier` | Contexto del cliente |
| `/archivo` | Histórico |

Persistencia dual: **localStorage** (rápido, sobrevive F5) + **Postgres/PGLite** (espejo por `user_id` cuando hay sesión).

## Instalador Windows (.exe)

```bash
npm install
npm run dist:win
```

Salida: `release/BlackBriefCEO-Setup-*.exe` (NSIS, acceso directo en escritorio).

## Principios

- Ancla o fuera
- Acción con dueño
- Sin fuentes inventadas
- Memoria de empresa, no solo del navegador

Created with Grok.
