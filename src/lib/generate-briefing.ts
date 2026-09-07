import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Briefing, ThreatItem } from "./types";

const executiveSchema = z.object({
  name: z.string(),
  role: z.string(),
});

const assetSchema = z.object({
  name: z.string(),
  type: z.string(),
  location: z.string(),
  note: z.string(),
});

const dossierSchema = z.object({
  companyName: z.string(),
  legalName: z.string(),
  sector: z.string(),
  hq: z.string(),
  size: z.string(),
  geographies: z.array(z.string()),
  executives: z.array(executiveSchema),
  assets: z.array(assetSchema),
  supplyChain: z.array(z.string()),
  competitors: z.array(z.string()),
  regulatory: z.string(),
  priorities: z.string(),
  knownExposures: z.string(),
  notes: z.string(),
});

const inputSchema = z.object({
  date: z.string(),
  dossier: dossierSchema,
  previousHeadlines: z.array(z.string()).max(12),
});

const SEVERITIES = ["critico", "alto", "vigilancia"] as const;
const VECTORS = [
  "cibernetico",
  "geopolitico",
  "regulatorio",
  "reputacional",
  "suministro",
  "fisico",
  "financiero",
  "personal",
  "operacional",
] as const;
const HORIZONS = ["hoy", "7d", "30d"] as const;

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced?.[1]?.trim() ?? trimmed;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("La respuesta no trajo un briefing usable.");
  }
  return JSON.parse(raw.slice(start, end + 1)) as unknown;
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

function asList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((v) => asString(v)).filter(Boolean);
}

function pick<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback;
}

function normalizeBriefing(
  raw: unknown,
  meta: { date: string; companyName: string },
): Briefing {
  if (!raw || typeof raw !== "object") {
    throw new Error("Briefing incompleto.");
  }
  const obj = raw as Record<string, unknown>;
  const itemsRaw = Array.isArray(obj.items) ? obj.items : [];
  const items: ThreatItem[] = itemsRaw.slice(0, 7).map((item, index) => {
    const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    return {
      id: asString(row.id) || `t-${index + 1}`,
      severity: pick(row.severity, SEVERITIES, "alto"),
      vector: pick(row.vector, VECTORS, "operacional"),
      horizon: pick(row.horizon, HORIZONS, "7d"),
      title: asString(row.title) || "Amenaza sin título",
      dossierAnchor: asString(row.dossierAnchor) || "Dossier",
      whyItMatters: asString(row.whyItMatters),
      action: asString(row.action),
      owner: asString(row.owner) || "CEO",
    };
  });

  if (items.length < 3) {
    throw new Error("El briefing no ancló suficientes amenazas al dossier.");
  }

  const mapped = items.filter((i) => i.dossierAnchor && i.whyItMatters && i.action).length;

  return {
    id: `brief-${meta.date}-${Date.now()}`,
    date: meta.date,
    generatedAt: new Date().toISOString(),
    source: "vivo",
    companyName: meta.companyName,
    headline: asString(obj.headline) || `Briefing de ${meta.companyName}`,
    situation: asString(obj.situation),
    items,
    watchlist: asList(obj.watchlist).slice(0, 6),
    close: asString(obj.close),
    signalNote:
      asString(obj.signalNote) ||
      `${mapped} amenazas ancladas al dossier · 0 recortes de prensa`,
  };
}

export const generateBriefing = createServerFn({ method: "POST" })
  .validator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "La generación no está disponible en este entorno." };
    }

    const company = data.dossier.companyName.trim();
    if (!company) {
      return { ok: false as const, error: "El dossier no tiene nombre de empresa." };
    }

    const system = `Eres el briefer matinal de un CEO. Producto: BlackBrief. No resumes internet. No recortas titulares. Mapeas amenazas plausibles y actuales SOBRE el dossier del cliente.

Reglas duras:
- Cada amenaza DEBE citar un ancla concreta del dossier (activo, persona, geografía, proveedor, contrato, exposición). Si no puedes anclarla, no la incluyas.
- No fabriques noticias con fuentes falsas (nada de "Reuters informó hoy…"). Usa condiciones estructurales reales (mercados, geopolítica, ciber, clima, regulación, logística, FX, concentración de proveedores) y conéctalas al cliente.
- Español, registro ejecutivo, seco, específico. Nombres propios. Lugares. Horizontes. Cero emojis. Cero jerga de consultora ("sinergias", "apalancar", "ecosistema").
- 5 a 6 amenazas cuando el dossier lo permita. Orden: crítico → alto → vigilancia.
- Al menos una amenaza con horizonte "hoy" si hay exposición operativa o personal activa.
- headline: una frase que el CEO pueda repetir en el comité sin slides.
- situation: 3-5 frases. Qué cambia para ESTA empresa, no para el mundo. Menciona 2–3 anclas del dossier por nombre.
- whyItMatters: el puente dossier → consecuencia cuantificable o irreversible (EBITDA, operación, listing, gente, clause, ventana logística).
- action: una decisión de hoy o esta semana, con dueño nombrado del dossier si existe.
- close: qué conversación tiene que ocurrir hoy si solo hay tiempo para una. Dos frases máximo.
- signalNote: formato "N amenazas ancladas al dossier · 0 recortes de prensa".
- Idioma: español, salvo que el dossier esté claramente en otro idioma.

Devuelve SOLO JSON con esta forma:
{
  "headline": string,
  "situation": string,
  "items": [{
    "id": string,
    "severity": "critico"|"alto"|"vigilancia",
    "vector": "cibernetico"|"geopolitico"|"regulatorio"|"reputacional"|"suministro"|"fisico"|"financiero"|"personal"|"operacional",
    "horizon": "hoy"|"7d"|"30d",
    "title": string,
    "dossierAnchor": string,
    "whyItMatters": string,
    "action": string,
    "owner": string
  }],
  "watchlist": string[],
  "close": string,
  "signalNote": string
}`;

    const user = [
      `Fecha del briefing: ${data.date}`,
      "",
      "DOSSIER DEL CLIENTE:",
      JSON.stringify(data.dossier, null, 2),
      "",
      data.previousHeadlines.length
        ? `No repitas estos enfoques recientes:\n- ${data.previousHeadlines.join("\n- ")}`
        : "No hay briefings previos.",
    ].join("\n");

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        temperature: 0.4,
        max_tokens: 3200,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });

    if (!res.ok) {
      return { ok: false as const, error: `No se pudo generar el briefing (${res.status}).` };
    }

    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = body.choices?.[0]?.message?.content ?? "";
    if (!text) {
      return { ok: false as const, error: "El modelo devolvió una respuesta vacía." };
    }

    try {
      const parsed = extractJson(text);
      const briefing = normalizeBriefing(parsed, {
        date: data.date,
        companyName: company,
      });
      return { ok: true as const, briefing };
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo leer el briefing.";
      return { ok: false as const, error: message };
    }
  });
