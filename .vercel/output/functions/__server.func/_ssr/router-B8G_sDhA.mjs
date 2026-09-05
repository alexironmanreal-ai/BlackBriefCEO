import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as createRootRoute, b as useRouter, d as useRouterState, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { a as string, i as object, n as literal, o as union, r as number } from "../_libs/zod.mjs";
import { n as TriangleAlert } from "../_libs/lucide-react.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-B8G_sDhA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function todayKey(date = /* @__PURE__ */ new Date()) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function formatBriefDate(isoDay) {
	const [y, m, d] = isoDay.split("-").map(Number);
	if (!y || !m || !d) return isoDay;
	const date = new Date(y, m - 1, d);
	return new Intl.DateTimeFormat("es-CL", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric"
	}).format(date);
}
function formatShortDate(isoDay) {
	const [y, m, d] = isoDay.split("-").map(Number);
	if (!y || !m || !d) return isoDay;
	const date = new Date(y, m - 1, d);
	return new Intl.DateTimeFormat("es-CL", {
		day: "2-digit",
		month: "short",
		year: "numeric"
	}).format(date);
}
function Wordmark({ className, size = "md" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-baseline gap-2", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("font-display tracking-tight text-foreground", size === "sm" ? "text-lg" : "text-xl"),
			children: "BlackBrief"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "kicker text-muted-foreground",
			children: "CEO"
		})]
	});
}
var EMPTY_DOSSIER = {
	companyName: "",
	legalName: "",
	sector: "",
	hq: "",
	size: "",
	geographies: [],
	executives: [{
		name: "",
		role: "CEO"
	}],
	assets: [{
		name: "",
		type: "",
		location: "",
		note: ""
	}],
	supplyChain: [],
	competitors: [],
	regulatory: "",
	priorities: "",
	knownExposures: "",
	notes: ""
};
var VECTOR_LABEL = {
	cibernetico: "Cibernético",
	geopolitico: "Geopolítico",
	regulatorio: "Regulatorio",
	reputacional: "Reputacional",
	suministro: "Cadena de suministro",
	fisico: "Físico",
	financiero: "Financiero",
	personal: "Personas",
	operacional: "Operacional"
};
var SEVERITY_LABEL = {
	critico: "Crítico",
	alto: "Alto",
	vigilancia: "Vigilancia"
};
var HORIZON_LABEL = {
	hoy: "Hoy",
	"7d": "7 días",
	"30d": "30 días"
};
var SAMPLE_DOSSIER = {
	companyName: "Helios Energía",
	legalName: "Helios Energía SpA",
	sector: "Generación renovable (solar, eólico) y almacenamiento BESS",
	hq: "Las Condes, Santiago, Chile",
	size: "1.200 empleados · 1,8 GW en operación · 900 MW en construcción",
	geographies: [
		"Desierto de Atacama, Chile",
		"Coquimbo, Chile",
		"Magallanes, Chile",
		"Arequipa, Perú",
		"Madrid, España (financiamiento)"
	],
	executives: [
		{
			name: "Valentina Ruiz",
			role: "CEO"
		},
		{
			name: "Martín Orellana",
			role: "CFO — roadshow pre-IPO"
		},
		{
			name: "Sofía Contreras",
			role: "COO / operaciones OT"
		},
		{
			name: "Diego Palacios",
			role: "Asuntos corporativos y comunidades"
		}
	],
	assets: [
		{
			name: "Planta solar Salar Alto",
			type: "Generación",
			location: "Atacama",
			note: "620 MW. Inversores Sungrow. Red OT parcialmente aislada, parches atrasados."
		},
		{
			name: "Parque eólico Cabo Negro",
			type: "Generación",
			location: "Magallanes",
			note: "280 MW. Logística por Estrecho de Magallanes. Ventanas climáticas estrechas."
		},
		{
			name: "BESS La Serena",
			type: "Almacenamiento",
			location: "Coquimbo",
			note: "200 MW / 800 MWh. Celdas CATL. Energización comprometida antes de diciembre."
		},
		{
			name: "Centro de control",
			type: "OT / IT",
			location: "Las Condes, Santiago",
			note: "SCADA unificado con VPN a plantas. Único punto de visibilidad operacional."
		},
		{
			name: "PPA Codelco",
			type: "Ingresos",
			location: "Chile",
			note: "Contrato a 15 años. ~18% del EBITDA. Renegociación abierta."
		}
	],
	supplyChain: [
		"Inversores Sungrow (China) — 70% del parque solar",
		"Celdas CATL (China) para BESS La Serena",
		"Turbinas y logística Vestas",
		"Financiamiento: BBVA + BID Invest",
		"EPC: Salfa (Chile) y consorcio local en Arequipa"
	],
	competitors: [
		"Colbún",
		"Enel Chile",
		"AES Andes",
		"Atlas Renewable"
	],
	regulatory: "SEC Chile, Coordinador Eléctrico Nacional, SEA (permisos ambientales), OSINERGMIN en Perú. CNMV si avanza el listing en Madrid.",
	priorities: "Cerrar round pre-IPO en el trimestre, energizar BESS La Serena antes de diciembre, renegociar PPA Codelco, reducir dependencia de un solo fabricante de inversores.",
	knownExposures: "Parches OT atrasados en Salar Alto. Servidumbres en disputa con comunidades colla cerca de Atacama. ~40% del capex en USD con ingresos en CLP. El CFO está en roadshow público en Londres y Madrid las próximas tres semanas.",
	notes: "La CEO lee el briefing a las 06:30. Quiere decisiones, no recortes de prensa. Prohibido el lenguaje de consultora."
};
var SAMPLE_BRIEFING = {
	id: "brief-helios-ref",
	date: "",
	generatedAt: "",
	source: "referencia",
	companyName: "Helios Energía",
	headline: "Tres frentes convergen esta semana: la planta que no puede parchearse en caliente, el CFO que está en cartelera pública, y un PPA que alguien más quiere reabrir.",
	situation: "Helios no tiene un problema de ‘noticias del sector energético’. Tiene un cuello de botella físico en Salar Alto, un ejecutivo expuesto en Europa, y un contrato que representa casi un quinto del EBITDA. El resto del ruido —precios spot, comunicados de competidores, foros de ciberseguridad— solo importa si toca uno de esos tres. Este briefing descarta lo demás.",
	items: [
		{
			id: "t1",
			severity: "critico",
			vector: "cibernetico",
			horizon: "hoy",
			title: "Salar Alto sigue siendo el único activo que no se puede aislar sin apagar megawatts",
			dossierAnchor: "Planta solar Salar Alto · red OT",
			whyItMatters: "El SCADA unificado del centro de Las Condes llega a Atacama por VPN. Los parches OT están atrasados. Un incidente de ransomware en generación chilena no necesita ser ‘sobre Helios’ para volverse tu problema: con 620 MW y un PPA Codelco detrás, una detención de 12 horas no es un ticket de TI, es una cláusula de suministro.",
			action: "Hoy: Sofía Contreras confirma que Salar Alto puede operar en isla (sin VPN a Santiago) y que el runbook de 4 horas existe en papel, no solo en Confluence. Si no existe, no hay briefing que lo invente — hay que escribirlo antes del lunes.",
			owner: "Sofía Contreras, COO"
		},
		{
			id: "t2",
			severity: "alto",
			vector: "personal",
			horizon: "7d",
			title: "El roadshow de Martín Orellana convierte al CFO en superficie de ataque, no en agenda de marketing",
			dossierAnchor: "Martín Orellana · Londres / Madrid",
			whyItMatters: "Tres semanas de hoteles, decks de valuación y reuniones con banks en dos capitales. El pre-IPO es prioridad del trimestre. Eso significa: itinerario reconstruible, materiales con cifras de EBITDA y PPA, y un ejecutivo que la prensa ya puede nombrar. El riesgo no es ‘un extraño en el lobby’. Es que el contenido del round circule antes que el round.",
			action: "Asuntos corporativos fija una regla de 48 h: ningún deck completo en correo personal, ningún itinerario en calendarios públicos, un solo canal de documentos. Seguridad física del hotel la cubre el banco anfitrión; la fuga de cifras no.",
			owner: "Diego Palacios + CFO"
		},
		{
			id: "t3",
			severity: "alto",
			vector: "financiero",
			horizon: "30d",
			title: "El PPA Codelco no es un contrato: es el 18% del EBITDA en una mesa que se puede reabrir",
			dossierAnchor: "PPA Codelco · renegociación abierta",
			whyItMatters: "Cualquier rumor de energía más barata —de Colbún, Enel o un BESS ajeno que se adelante al tuyo— le da a Codelco una palanca que el roadshow no puede permitirse. Helios necesita el contrato firme para el round. El competidor no tiene que ganarte el cliente; le basta con que el precio se vuelva ‘discutible’ durante la due diligence.",
			action: "Valentina Ruiz habla con el sponsor en Codelco esta semana, no con ‘el área de abastecimiento’. Objetivo: congelar términos hasta cierre del round o, si no, documentar por escrito el rango. El banco de la IPO no acepta un ‘estamos conversando’.",
			owner: "Valentina Ruiz, CEO"
		},
		{
			id: "t4",
			severity: "alto",
			vector: "suministro",
			horizon: "30d",
			title: "Sungrow y CATL no son proveedores. Son un solo país sentado en el 70% del solar y en todo el BESS",
			dossierAnchor: "Sungrow · CATL · BESS La Serena",
			whyItMatters: "La prioridad de energizar La Serena antes de diciembre asume que las celdas llegan. Un control de exportación, una cola portuaria o un recambio de firmware impuesto por el fabricante no es un escenario extremo: es el único modo de fallo que tumba a la vez el parque solar y el almacenamiento. El round pre-IPO premiará diversificación; hoy no la hay.",
			action: "Compras abre un segundo fabricante de inversores con lead time real (no brochure) y un plan B de celdas para el 30% de La Serena. Si el plan B no cabe en el calendario de diciembre, el board debe oírlo ahora, no en noviembre.",
			owner: "COO + Abastecimiento"
		},
		{
			id: "t5",
			severity: "vigilancia",
			vector: "regulatorio",
			horizon: "30d",
			title: "La servidumbre colla en Atacama puede no detener Salar Alto. Puede detener la historia que le estás vendiendo a Madrid",
			dossierAnchor: "Comunidades colla · SEA · listing Madrid",
			whyItMatters: "Los inversionistas europeos del roadshow preguntan ESG en la primera hora. Un conflicto de servidumbre no necesita sentencia para convertirse en footnote de risk factors. Diego Palacios ya tiene el mapa; el banco de la IPO todavía no.",
			action: "Una página, no un informe: estado del diálogo, qué se pidió, qué se ofreció, fecha del próximo hito SEA. Va al data room esta semana.",
			owner: "Diego Palacios"
		}
	],
	watchlist: [
		"Tipo de cambio CLP/USD — 40% del capex está nominado en dólares.",
		"Ventana climática en Magallanes para Cabo Negro: un mes perdido no se recupera en el Estrecho.",
		"Movimientos de Colbún o AES Andes cerca de clientes industriales de cobre.",
		"Firmware y boletines de Sungrow — no esperar al parche ‘cuando haya ventana’."
	],
	close: "Si solo hay capacidad para una conversación hoy, que sea esta: ¿puede Salar Alto operar desconectado de Santiago? La segunda, esta tarde: ¿el PPA con Codelco está congelado o está a merced del próximo correo de un competidor? El roadshow espera. La planta, no.",
	signalNote: "5 amenazas ancladas al dossier · 0 recortes de prensa"
};
function stampSampleBriefing(date) {
	return {
		...SAMPLE_BRIEFING,
		id: `brief-helios-${date}`,
		date,
		generatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
var useBriefStore = create()(persist((set, get) => ({
	hydrated: false,
	dossier: null,
	briefings: {},
	activeDate: todayKey(),
	generating: false,
	generateError: null,
	setHydrated: (value) => set({ hydrated: value }),
	setDossier: (dossier) => set({ dossier }),
	loadSample: () => {
		const date = todayKey();
		const briefing = stampSampleBriefing(date);
		set({
			dossier: SAMPLE_DOSSIER,
			briefings: {
				...get().briefings,
				[date]: briefing
			},
			activeDate: date,
			generateError: null
		});
	},
	startBlank: () => set({
		dossier: {
			...EMPTY_DOSSIER,
			executives: [{
				name: "",
				role: "CEO"
			}]
		},
		activeDate: todayKey()
	}),
	resetAll: () => set({
		dossier: null,
		briefings: {},
		activeDate: todayKey(),
		generateError: null
	}),
	setActiveDate: (date) => set({ activeDate: date }),
	saveBriefing: (briefing) => set({
		briefings: {
			...get().briefings,
			[briefing.date]: briefing
		},
		activeDate: briefing.date
	}),
	setGenerating: (value) => set({ generating: value }),
	setGenerateError: (value) => set({ generateError: value }),
	todayBriefing: () => get().briefings[todayKey()],
	activeBriefing: () => get().briefings[get().activeDate],
	archiveList: () => Object.values(get().briefings).sort((a, b) => b.date.localeCompare(a.date))
}), {
	name: "blackbrief-ceo",
	skipHydration: true,
	partialize: (state) => ({
		dossier: state.dossier,
		briefings: state.briefings,
		activeDate: state.activeDate
	})
}));
var NAV = [
	{
		to: "/",
		label: "Briefing"
	},
	{
		to: "/dossier",
		label: "Dossier"
	},
	{
		to: "/archivo",
		label: "Archivo"
	}
];
function Shell({ children }) {
	const [ready, setReady] = (0, import_react.useState)(false);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const dossier = useBriefStore((s) => s.dossier);
	(0, import_react.useEffect)(() => {
		const persist = useBriefStore.persist;
		const finish = () => {
			useBriefStore.setState({
				hydrated: true,
				activeDate: todayKey()
			});
			setReady(true);
		};
		if (persist.hasHydrated()) {
			finish();
			return;
		}
		const unsub = persist.onFinishHydration(finish);
		persist.rehydrate();
		return unsub;
	}, []);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "no-print sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "min-h-11 min-w-11 content-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, { size: "sm" })
					}), dossier ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex items-center gap-1 text-sm",
						children: NAV.map((item) => {
							const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: item.to,
								className: cn("flex h-11 items-center px-3 text-muted-foreground transition-colors duration-150", active && "text-foreground"),
								children: item.label
							}, item.to);
						})
					}) : null]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: "dark",
				position: "bottom-center",
				toastOptions: { className: "!bg-card !text-foreground !border-border !rounded-md !font-sans" }
			})
		]
	});
}
var styles_default = "/assets/styles-BxRyjIMV.css";
var APP_NAME = "BlackBriefCEO";
var Route$3 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Briefing ejecutivo de amenazas. Resume el contexto del cliente, no internet."
			},
			{
				name: "theme-color",
				content: "#0b0b0a"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "es",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$2 = () => import("./routes-vPRlBTuS.mjs");
var Route$2 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./archivo-D8zmnRIn.mjs");
var Route$1 = createFileRoute("/archivo")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./dossier-IfUFaIGL.mjs");
var Route = createFileRoute("/dossier")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$2.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$3
	}),
	ArchivoRoute: Route$1.update({
		id: "/archivo",
		path: "/archivo",
		getParentRoute: () => Route$3
	}),
	DossierRoute: Route.update({
		id: "/dossier",
		path: "/dossier",
		getParentRoute: () => Route$3
	})
};
var routeTree = Route$3._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { VECTOR_LABEL as a, formatShortDate as c, SEVERITY_LABEL as i, todayKey as l, useBriefStore as n, cn as o, HORIZON_LABEL as r, formatBriefDate as s, router_exports as t };
