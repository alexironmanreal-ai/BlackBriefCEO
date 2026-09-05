import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { a as string, i as object, t as array } from "../_libs/zod.mjs";
import { c as ArrowRight, i as Printer, o as FileText, s as Copy } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as VECTOR_LABEL, i as SEVERITY_LABEL, l as todayKey, n as useBriefStore, o as cn, r as HORIZON_LABEL, s as formatBriefDate } from "./router-B8G_sDhA.mjs";
import { t as Button } from "./button-CE9oDF-Q.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-vPRlBTuS.js
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium uppercase tracking-wide", {
	variants: { variant: {
		default: "bg-muted text-muted-foreground",
		critico: "bg-destructive/15 text-destructive",
		alto: "bg-high/15 text-high",
		vigilancia: "bg-watch/15 text-watch",
		paper: "bg-primary/10 text-primary"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function Separator({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "separator",
		className: cn("h-px w-full bg-border", className)
	});
}
function briefingToPlainText(briefing) {
	const lines = [
		"BLACKBRIEF CEO — USO INTERNO",
		briefing.companyName.toUpperCase(),
		formatBriefDate(briefing.date),
		"",
		briefing.headline,
		"",
		briefing.situation,
		"",
		"AMENAZAS MAPEADAS AL DOSSIER",
		""
	];
	briefing.items.forEach((item, index) => {
		const n = String(index + 1).padStart(2, "0");
		lines.push(`${n}. ${SEVERITY_LABEL[item.severity].toUpperCase()} · ${VECTOR_LABEL[item.vector]} · ${HORIZON_LABEL[item.horizon]}`);
		lines.push(item.title);
		lines.push(`Ancla: ${item.dossierAnchor}`);
		lines.push(`Por qué te importa: ${item.whyItMatters}`);
		lines.push(`Acción: ${item.action}`);
		lines.push(`Owner: ${item.owner}`);
		lines.push("");
	});
	if (briefing.watchlist.length) {
		lines.push("VIGILANCIA");
		lines.push("");
		briefing.watchlist.forEach((w) => lines.push(`· ${w}`));
		lines.push("");
	}
	lines.push("PARA EL CEO");
	lines.push("");
	lines.push(briefing.close);
	lines.push("");
	lines.push(briefing.signalNote);
	return lines.join("\n");
}
function severityVariant(severity) {
	return severity;
}
function BriefingView({ briefing, actions }) {
	async function copyText() {
		try {
			await navigator.clipboard.writeText(briefingToPlainText(briefing));
			toast("Briefing copiado. Listo para el correo de las 06:30.");
		} catch {
			toast("No se pudo copiar. Prueba exportar.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "enter-stagger",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "kicker",
						children: ["Confidencial · uso interno · ", briefing.source === "vivo" ? "generado" : "referencia"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted-foreground",
						children: briefing.companyName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm capitalize text-muted-foreground",
						children: formatBriefDate(briefing.date)
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "no-print flex flex-wrap gap-2",
					children: actions
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-10 max-w-3xl font-display text-3xl leading-snug tracking-tight sm:text-4xl",
				children: briefing.headline
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground",
				children: briefing.situation
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-xs tracking-wide text-muted-foreground",
				children: briefing.signalNote
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 flex items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "kicker",
					children: "Amenazas mapeadas al dossier"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs tabular-nums text-muted-foreground",
					children: String(briefing.items.length).padStart(2, "0")
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "mt-3 bg-rule" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-2",
				children: briefing.items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "border-b border-border py-8 last:border-b-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-lg tabular-nums text-muted-foreground",
									children: String(index + 1).padStart(2, "0")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: severityVariant(item.severity),
									children: SEVERITY_LABEL[item.severity]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: VECTOR_LABEL[item.vector] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "paper",
									children: HORIZON_LABEL[item.horizon]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-4 max-w-3xl text-lg font-medium leading-snug tracking-tight",
							children: item.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs tracking-wide text-muted-foreground",
							children: ["Ancla · ", item.dossierAnchor]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 grid gap-5 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "kicker",
								children: "Por qué te importa"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-foreground/90",
								children: item.whyItMatters
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "kicker",
									children: "Acción"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm leading-relaxed text-foreground/90",
									children: item.action
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-3 text-xs text-muted-foreground",
									children: ["Owner · ", item.owner]
								})
							] })]
						})
					]
				}, item.id))
			}),
			briefing.watchlist.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "kicker",
						children: "Vigilancia"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "mt-3 bg-rule" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-5 space-y-3",
						children: briefing.watchlist.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-3 text-sm leading-relaxed text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-2 size-1 shrink-0 rounded-full bg-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item })]
						}, item))
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-12 rounded-xl bg-card p-5 sm:p-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "kicker",
					children: "Para el CEO"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-2xl font-display text-xl leading-snug tracking-tight",
					children: briefing.close
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "no-print mt-8 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => void copyText(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {}), "Copiar"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					onClick: () => window.print(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, {}), "Exportar"]
				})]
			})
		]
	});
}
function GenerateBar({ onGenerate, generating, label, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		onClick: onGenerate,
		disabled: generating,
		className: cn("min-w-44", className),
		children: generating ? "Cruzando el dossier…" : label
	});
}
function Skeleton({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("shimmer rounded-sm bg-muted", className) });
}
var LINES = [
	"Leyendo activos, no titulares.",
	"Descartando lo que no toca el dossier.",
	"Anclando cada amenaza a un nombre propio."
];
function GeneratingState({ companyName }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "enter-stagger max-w-2xl pt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "kicker",
				children: ["06:30 · ", companyName]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-6 font-display text-3xl tracking-tight",
				children: "Cruzando el dossier con el entorno."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm leading-relaxed text-muted-foreground",
				children: "No se está resumiendo internet. Se está preguntando qué, de todo lo que se mueve, le importa a esta empresa."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-8 space-y-3",
				children: LINES.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-sm text-muted-foreground",
					children: line
				}, line))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-5/6" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-full" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-4/5" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-8 h-24 w-full rounded-md" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 w-full rounded-md" })
				]
			})
		]
	});
}
function Onboarding() {
	const navigate = useNavigate();
	const loadSample = useBriefStore((s) => s.loadSample);
	const startBlank = useBriefStore((s) => s.startBlank);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "enter-stagger mx-auto max-w-2xl pt-4 sm:pt-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: "Uso interno · cada mañana"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-8 font-display text-4xl leading-tight tracking-tight text-foreground sm:text-5xl",
				children: "Internet está lleno de amenazas. Casi ninguna es tuya."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 max-w-xl text-base leading-relaxed text-muted-foreground",
				children: "BlackBrief no resume el día. Resume el contexto de una empresa: activos, personas, contratos, geografía. El briefing de las 06:30 solo existe si hay un dossier."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 flex flex-col gap-3 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "lg",
					onClick: () => {
						loadSample();
						navigate({ to: "/" });
					},
					children: ["Ver Helios Energía", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "lg",
					variant: "outline",
					onClick: () => {
						startBlank();
						navigate({ to: "/dossier" });
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {}), "Definir mi empresa"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 max-w-md text-xs leading-relaxed text-muted-foreground",
				children: "Helios es un dossier de referencia — generación renovable en Chile y Perú, pre-IPO, un PPA que pesa el 18% del EBITDA. Sirve para entender el producto antes de cargar el tuyo."
			})
		]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
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
var generateBriefing = createServerFn({ method: "POST" }).validator((input) => inputSchema.parse(input)).handler(createSsrRpc("6ba92ff8eed8b828c583f83f1eb8ebeac414e500e2d6d648b942ec8fda59a12a"));
async function runGenerate() {
	const state = useBriefStore.getState();
	const dossier = state.dossier;
	if (!dossier?.companyName.trim()) {
		state.setGenerateError("Define la empresa en el dossier antes de generar.");
		return false;
	}
	if (state.generating) return false;
	state.setGenerating(true);
	state.setGenerateError(null);
	const date = todayKey();
	const previousHeadlines = Object.values(state.briefings).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8).flatMap((b) => [b.headline, ...b.items.map((i) => i.title)]).slice(0, 12);
	try {
		const result = await generateBriefing({ data: {
			date,
			dossier,
			previousHeadlines
		} });
		if (!result.ok) {
			state.setGenerateError(result.error);
			return false;
		}
		state.saveBriefing(result.briefing);
		return true;
	} catch {
		state.setGenerateError("No se pudo generar el briefing. Inténtalo de nuevo.");
		return false;
	} finally {
		useBriefStore.getState().setGenerating(false);
	}
}
function Home() {
	const hydrated = useBriefStore((s) => s.hydrated);
	const dossier = useBriefStore((s) => s.dossier);
	const generating = useBriefStore((s) => s.generating);
	const generateError = useBriefStore((s) => s.generateError);
	const activeDate = useBriefStore((s) => s.activeDate);
	const briefing = useBriefStore((s) => s.briefings[s.activeDate]);
	const setActiveDate = useBriefStore((s) => s.setActiveDate);
	const today = todayKey();
	const viewingPast = Boolean(briefing && activeDate !== today);
	if (!hydrated) return null;
	if (!dossier) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Onboarding, {});
	if (generating) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GeneratingState, { companyName: dossier.companyName || "la empresa" });
	if (!briefing) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "enter-stagger max-w-2xl pt-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: "Listo cuando el dossier lo esté"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "mt-5 font-display text-3xl tracking-tight sm:text-4xl",
				children: [
					"El briefing de ",
					dossier.companyName || "hoy",
					" aún no existe."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 max-w-xl text-base leading-relaxed text-muted-foreground",
				children: "No vamos a rellenar esto con titulares. Cuando lo pidas, cada amenaza tiene que apuntar a un activo, una persona o un contrato de este dossier."
			}),
			generateError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 text-sm text-destructive",
				children: generateError
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-col gap-3 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GenerateBar, {
					generating,
					onGenerate: () => void runGenerate(),
					label: "Generar briefing de esta mañana"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/dossier",
						children: "Revisar dossier"
					})
				})]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		viewingPast ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "no-print mb-8 flex flex-wrap items-center justify-between gap-3 rounded-md bg-card px-4 py-3 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "Estás leyendo un briefing anterior."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				size: "sm",
				onClick: () => setActiveDate(today),
				children: "Volver a hoy"
			})]
		}) : null,
		generateError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-6 text-sm text-destructive",
			children: generateError
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BriefingView, {
			briefing,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GenerateBar, {
				generating,
				onGenerate: () => void runGenerate(),
				label: briefing.source === "referencia" ? "Generar briefing de esta mañana" : "Regenerar el de hoy"
			})
		})
	] });
}
//#endregion
export { Home as component };
