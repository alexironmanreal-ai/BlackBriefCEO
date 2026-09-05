import { a as string, i as object, t as array } from "../_libs/zod.mjs";
import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/generate-briefing-CHqtVbK8.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var executiveSchema = object({
	name: string(),
	role: string()
});
var assetSchema = object({
	name: string(),
	type: string(),
	location: string(),
	note: string()
});
var dossierSchema = object({
	companyName: string(),
	legalName: string(),
	sector: string(),
	hq: string(),
	size: string(),
	geographies: array(string()),
	executives: array(executiveSchema),
	assets: array(assetSchema),
	supplyChain: array(string()),
	competitors: array(string()),
	regulatory: string(),
	priorities: string(),
	knownExposures: string(),
	notes: string()
});
var inputSchema = object({
	date: string(),
	dossier: dossierSchema,
	previousHeadlines: array(string()).max(12)
});
var SEVERITIES = [
	"critico",
	"alto",
	"vigilancia"
];
var VECTORS = [
	"cibernetico",
	"geopolitico",
	"regulatorio",
	"reputacional",
	"suministro",
	"fisico",
	"financiero",
	"personal",
	"operacional"
];
var HORIZONS = [
	"hoy",
	"7d",
	"30d"
];
function extractJson(text) {
	const trimmed = text.trim();
	const raw = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1]?.trim() ?? trimmed;
	const start = raw.indexOf("{");
	const end = raw.lastIndexOf("}");
	if (start === -1 || end === -1 || end <= start) throw new Error("La respuesta no trajo un briefing usable.");
	return JSON.parse(raw.slice(start, end + 1));
}
function asString(value, fallback = "") {
	return typeof value === "string" ? value.trim() : fallback;
}
function asList(value) {
	if (!Array.isArray(value)) return [];
	return value.map((v) => asString(v)).filter(Boolean);
}
function pick(value, allowed, fallback) {
	return typeof value === "string" && allowed.includes(value) ? value : fallback;
}
function normalizeBriefing(raw, meta) {
	if (!raw || typeof raw !== "object") throw new Error("Briefing incompleto.");
	const obj = raw;
	const items = (Array.isArray(obj.items) ? obj.items : []).slice(0, 7).map((item, index) => {
		const row = item && typeof item === "object" ? item : {};
		return {
			id: asString(row.id) || `t-${index + 1}`,
			severity: pick(row.severity, SEVERITIES, "alto"),
			vector: pick(row.vector, VECTORS, "operacional"),
			horizon: pick(row.horizon, HORIZONS, "7d"),
			title: asString(row.title) || "Amenaza sin título",
			dossierAnchor: asString(row.dossierAnchor) || "Dossier",
			whyItMatters: asString(row.whyItMatters),
			action: asString(row.action),
			owner: asString(row.owner) || "CEO"
		};
	});
	if (items.length < 3) throw new Error("El briefing no ancló suficientes amenazas al dossier.");
	const mapped = items.filter((i) => i.dossierAnchor && i.whyItMatters && i.action).length;
	return {
		id: `brief-${meta.date}-${Date.now()}`,
		date: meta.date,
		generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		source: "vivo",
		companyName: meta.companyName,
		headline: asString(obj.headline) || `Briefing de ${meta.companyName}`,
		situation: asString(obj.situation),
		items,
		watchlist: asList(obj.watchlist).slice(0, 6),
		close: asString(obj.close),
		signalNote: asString(obj.signalNote) || `${mapped} amenazas ancladas al dossier · 0 recortes de prensa`
	};
}
var generateBriefing_createServerFn_handler = createServerRpc({
	id: "6ba92ff8eed8b828c583f83f1eb8ebeac414e500e2d6d648b942ec8fda59a12a",
	name: "generateBriefing",
	filename: "src/lib/generate-briefing.ts"
}, (opts) => generateBriefing.__executeServer(opts));
var generateBriefing = createServerFn({ method: "POST" }).validator((input) => inputSchema.parse(input)).handler(generateBriefing_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "La generación no está disponible en este entorno."
	};
	const company = data.dossier.companyName.trim();
	if (!company) return {
		ok: false,
		error: "El dossier no tiene nombre de empresa."
	};
	const system = `Eres el briefer matinal de un CEO. No resumes internet. No recortas titulares. Mapeas amenazas plausibles y actuales SOBRE el dossier del cliente.

Reglas:
- Cada amenaza DEBE citar un ancla concreta del dossier (activo, persona, geografía, proveedor, contrato, exposición). Si no puedes anclarla, no la incluyas.
- No fabriques noticias con fuentes falsas (nada de "Reuters informó hoy…"). Usa condiciones estructurales reales (mercados, geopolítica, ciber, clima, regulación, logística) y conéctalas al cliente.
- Español, registro ejecutivo, seco, específico. Nombres propios. Lugares. Horizontes. Cero emojis. Cero jerga de consultora.
- 4 a 6 amenazas. Orden: crítico primero.
- headline: una frase que el CEO pueda repetir en el comité.
- situation: 3-5 frases. Qué cambia para ESTA empresa, no para el mundo.
- whyItMatters: el puente dossier → consecuencia (EBITDA, operación, listing, gente).
- action: una decisión de hoy o esta semana, con dueño.
- close: qué conversación tiene que ocurrir hoy si solo hay tiempo para una.
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
		data.previousHeadlines.length ? `No repitas estos enfoques recientes:\n- ${data.previousHeadlines.join("\n- ")}` : "No hay briefings previos."
	].join("\n");
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			temperature: .4,
			max_tokens: 3200,
			response_format: { type: "json_object" },
			messages: [{
				role: "system",
				content: system
			}, {
				role: "user",
				content: user
			}]
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `No se pudo generar el briefing (${res.status}).`
	};
	const text = (await res.json()).choices?.[0]?.message?.content ?? "";
	if (!text) return {
		ok: false,
		error: "El modelo devolvió una respuesta vacía."
	};
	try {
		return {
			ok: true,
			briefing: normalizeBriefing(extractJson(text), {
				date: data.date,
				companyName: company
			})
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "No se pudo leer el briefing."
		};
	}
});
//#endregion
export { generateBriefing_createServerFn_handler };
