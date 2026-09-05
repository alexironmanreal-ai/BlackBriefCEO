import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { c as formatShortDate, l as todayKey, n as useBriefStore, s as formatBriefDate } from "./router-B8G_sDhA.mjs";
import { t as Button } from "./button-CE9oDF-Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/archivo-D8zmnRIn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ArchivePage() {
	const hydrated = useBriefStore((s) => s.hydrated);
	const dossier = useBriefStore((s) => s.dossier);
	const briefingsMap = useBriefStore((s) => s.briefings);
	const setActiveDate = useBriefStore((s) => s.setActiveDate);
	const navigate = useNavigate();
	const today = todayKey();
	const briefings = (0, import_react.useMemo)(() => Object.values(briefingsMap).sort((a, b) => b.date.localeCompare(a.date)), [briefingsMap]);
	(0, import_react.useEffect)(() => {
		if (hydrated && !dossier) navigate({ to: "/" });
	}, [
		hydrated,
		dossier,
		navigate
	]);
	if (!dossier) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "kicker",
			children: "Histórico"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-3 font-display text-3xl tracking-tight sm:text-4xl",
			children: "Archivo"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground",
			children: "Cada mañana debería ser distinta porque el dossier cambia, no porque cambie el titular de portada."
		}),
		briefings.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-12 max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Todavía no hay briefings. El primero queda aquí cuando lo generes."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-6",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					children: "Ir al briefing"
				})
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-10 divide-y divide-border border-t border-border",
			children: briefings.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "flex w-full flex-col gap-2 py-5 text-left transition-colors duration-150 hover:bg-muted/40 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8",
				onClick: () => {
					setActiveDate(item.date);
					navigate({ to: "/" });
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs capitalize text-muted-foreground",
						children: [
							formatBriefDate(item.date),
							item.date === today ? " · hoy" : "",
							item.source === "referencia" ? " · referencia" : ""
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-2xl text-sm leading-snug text-foreground",
						children: item.headline
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "shrink-0 text-xs tabular-nums text-muted-foreground",
					children: [
						formatShortDate(item.date),
						" · ",
						String(item.items.length).padStart(2, "0")
					]
				})]
			}) }, item.id))
		})
	] });
}
//#endregion
export { ArchivePage as component };
