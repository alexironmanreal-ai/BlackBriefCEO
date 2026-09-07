# BlackBriefCEO

**Briefing ejecutivo de amenazas anclado al dossier del cliente — no a internet.**

Cada mañana el CEO no necesita otro recorte de prensa. Necesita saber qué, de todo lo que se mueve, toca *sus* activos, *su* gente, *sus* contratos y *su* geografía.

## Qué es

BlackBriefCEO es un producto de inteligencia ejecutiva:

1. **Dossier** — identidad, teatro de operaciones, personas, activos críticos, cadena de suministro, exposiciones y prioridades del trimestre.
2. **Briefing** — 4–6 amenazas mapeadas a anclas concretas del dossier (planta, PPA, CFO en roadshow, proveedor único…).
3. **Archivo** — historial local de briefings por fecha.

No resume titulares. Si una amenaza no puede anclarse al dossier, no entra.

## Stack

- TanStack Start + React 19 + Tailwind v4
- Zustand (persistencia local del dossier y archivo)
- xAI (`grok-4.5`) vía server function para generación en vivo
- UI editorial oscura (Fraunces + IBM Plex Sans)

## Arranque

```bash
npm install
npm run dev
```

La app escucha en `0.0.0.0:8080`. Para generar briefings en vivo hace falta `XAI_API_KEY` en el entorno del servidor (inyectada por la plataforma en deploy; no va en `.env` del cliente).

## Flujo de producto

| Paso | Acción |
|------|--------|
| 1 | Cargar el dossier de ejemplo (Helios Energía) o definir el propio |
| 2 | Leer el briefing de referencia o generar el de la mañana |
| 3 | Copiar / exportar para el correo de las 06:30 |
| 4 | Refinar el dossier; el siguiente briefing mejora con más anclas |

## Principios

- **Ancla o fuera** — cada ítem cita un activo, persona, contrato o exposición real del dossier.
- **Acción con dueño** — no hay “monitorear”; hay decisión y owner.
- **Sin fuentes inventadas** — condiciones estructurales, no “Reuters dijo hoy…”.
- **Datos en el dispositivo** — dossier y archivo en `localStorage` (`blackbrief-ceo`).

## Rutas

- `/` — briefing del día (o onboarding)
- `/dossier` — editor del contexto del cliente
- `/archivo` — histórico

## Licencia

Uso interno del proyecto. Created with Grok.
