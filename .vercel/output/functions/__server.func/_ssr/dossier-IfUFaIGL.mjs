import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime, t as Root } from "../_libs/@radix-ui/react-label+[...].mjs";
import { a as Plus, r as Trash2, t as X } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useBriefStore, o as cn } from "./router-B8G_sDhA.mjs";
import { t as Button } from "./button-CE9oDF-Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dossier-IfUFaIGL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-11 w-full rounded-sm border border-input bg-muted px-3 text-sm text-foreground shadow-[0_0_0_1px_transparent] transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground/70 focus-visible:border-ring/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn("text-xs font-medium tracking-wide text-muted-foreground", className),
	...props
}));
Label.displayName = Root.displayName;
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-28 w-full rounded-sm border border-input bg-muted px-3 py-3 text-sm text-foreground transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground/70 focus-visible:border-ring/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
function TagInput({ values, onChange, placeholder }) {
	const [draft, setDraft] = (0, import_react.useState)("");
	function add(raw) {
		const value = raw.trim();
		if (!value) return;
		if (values.some((v) => v.toLowerCase() === value.toLowerCase())) {
			setDraft("");
			return;
		}
		onChange([...values, value]);
		setDraft("");
	}
	function onKeyDown(event) {
		if (event.key === "Enter" || event.key === ",") {
			event.preventDefault();
			add(draft);
		}
		if (event.key === "Backspace" && !draft && values.length) onChange(values.slice(0, -1));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-sm border border-input bg-muted px-2 py-2",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap gap-1.5",
			children: [values.map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex max-w-full items-center gap-1 rounded-sm bg-background px-2 py-1 text-xs text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: value
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "relative size-5 text-muted-foreground after:absolute after:left-1/2 after:top-1/2 after:size-10 after:-translate-x-1/2 after:-translate-y-1/2 hover:text-foreground",
					onClick: () => onChange(values.filter((v) => v !== value)),
					"aria-label": `Quitar ${value}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3" })
				})]
			}, value)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: draft,
				onChange: (e) => setDraft(e.target.value),
				onKeyDown,
				onBlur: () => add(draft),
				placeholder: values.length ? "" : placeholder,
				className: cn("h-8 min-w-40 flex-1 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0")
			})]
		})
	});
}
function dossierScore(dossier) {
	const checks = [
		dossier.companyName.trim(),
		dossier.sector.trim(),
		dossier.hq.trim(),
		dossier.geographies.some((g) => g.trim()),
		dossier.executives.some((e) => e.name.trim()),
		dossier.assets.some((a) => a.name.trim()),
		dossier.supplyChain.some((s) => s.trim()) || dossier.competitors.some((c) => c.trim()),
		dossier.priorities.trim() || dossier.knownExposures.trim()
	];
	return {
		filled: checks.filter(Boolean).length,
		total: checks.length
	};
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
function Section({ kicker, title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-card p-5 sm:p-7",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: kicker
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-2 font-display text-2xl tracking-tight",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 space-y-5",
				children
			})
		]
	});
}
function DossierForm() {
	const navigate = useNavigate();
	const dossier = useBriefStore((s) => s.dossier);
	const setDossier = useBriefStore((s) => s.setDossier);
	const loadSample = useBriefStore((s) => s.loadSample);
	const resetAll = useBriefStore((s) => s.resetAll);
	if (!dossier) return null;
	const score = dossierScore(dossier);
	function patch(partial) {
		setDossier({
			...dossier,
			...partial
		});
	}
	function setExecutive(index, next) {
		patch({ executives: dossier.executives.map((row, i) => i === index ? next : row) });
	}
	function setAsset(index, next) {
		patch({ assets: dossier.assets.map((row, i) => i === index ? next : row) });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "kicker",
						children: "El briefing es tan bueno como esto"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 font-display text-3xl tracking-tight sm:text-4xl",
						children: "Dossier"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground",
						children: [
							"Nombres, plantas, contratos, gente. Sin esto, cualquier resumen es periodismo. Completitud ",
							score.filled,
							"/",
							score.total,
							"."
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs tabular-nums text-muted-foreground",
					children: [
						score.filled,
						"/",
						score.total,
						" campos ancla"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				kicker: "01",
				title: "Identidad",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Empresa",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: dossier.companyName,
								onChange: (e) => patch({ companyName: e.target.value }),
								placeholder: "Helios Energía"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Razón social",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: dossier.legalName,
								onChange: (e) => patch({ legalName: e.target.value }),
								placeholder: "Helios Energía SpA"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Sector",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: dossier.sector,
								onChange: (e) => patch({ sector: e.target.value }),
								placeholder: "Generación renovable"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Sede",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: dossier.hq,
								onChange: (e) => patch({ hq: e.target.value }),
								placeholder: "Santiago, Chile"
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Escala",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: dossier.size,
						onChange: (e) => patch({ size: e.target.value }),
						placeholder: "Personas, MW, ingresos, plantas"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				kicker: "02",
				title: "Teatro de operaciones",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Geografías",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TagInput, {
							values: dossier.geographies,
							onChange: (geographies) => patch({ geographies }),
							placeholder: "Escribe y pulsa Enter"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Competidores",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TagInput, {
							values: dossier.competitors,
							onChange: (competitors) => patch({ competitors }),
							placeholder: "Quién puede mover tu precio o tu gente"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Marco regulatorio",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: dossier.regulatory,
							onChange: (e) => patch({ regulatory: e.target.value }),
							placeholder: "Permisos, supervisores, listings"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				kicker: "03",
				title: "Personas",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: dossier.executives.map((row, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2 sm:grid-cols-[1fr_1fr_auto]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: row.name,
								onChange: (e) => setExecutive(index, {
									...row,
									name: e.target.value
								}),
								placeholder: "Nombre",
								"aria-label": "Nombre del ejecutivo"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: row.role,
								onChange: (e) => setExecutive(index, {
									...row,
									role: e.target.value
								}),
								placeholder: "Rol",
								"aria-label": "Rol"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								size: "icon",
								className: "justify-self-end",
								onClick: () => patch({ executives: dossier.executives.filter((_, i) => i !== index) }),
								"aria-label": "Quitar ejecutivo",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
							})
						]
					}, index))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "outline",
					size: "sm",
					onClick: () => patch({ executives: [...dossier.executives, {
						name: "",
						role: ""
					}] }),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), "Añadir persona"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				kicker: "04",
				title: "Activos críticos",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-6",
					children: dossier.assets.map((row, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 rounded-md bg-background p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2 sm:grid-cols-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: row.name,
										onChange: (e) => setAsset(index, {
											...row,
											name: e.target.value
										}),
										placeholder: "Nombre del activo"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: row.type,
										onChange: (e) => setAsset(index, {
											...row,
											type: e.target.value
										}),
										placeholder: "Tipo"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: row.location,
										onChange: (e) => setAsset(index, {
											...row,
											location: e.target.value
										}),
										placeholder: "Ubicación"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: row.note,
								onChange: (e) => setAsset(index, {
									...row,
									note: e.target.value
								}),
								placeholder: "Por qué es crítico: dependencia, contrato, fallo único",
								className: "min-h-20"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "ghost",
								size: "sm",
								onClick: () => patch({ assets: dossier.assets.filter((_, i) => i !== index) }),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {}), "Quitar activo"]
							})
						]
					}, index))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "outline",
					size: "sm",
					onClick: () => patch({ assets: [...dossier.assets, {
						name: "",
						type: "",
						location: "",
						note: ""
					}] }),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), "Añadir activo"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				kicker: "05",
				title: "Dependencias y exposición",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Cadena de suministro",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TagInput, {
							values: dossier.supplyChain,
							onChange: (supplyChain) => patch({ supplyChain }),
							placeholder: "Proveedor, banco, EPC, tecnología"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Prioridades de este trimestre",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: dossier.priorities,
							onChange: (e) => patch({ priorities: e.target.value }),
							placeholder: "Qué no puede fallar en los próximos 90 días"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Exposiciones ya conocidas",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: dossier.knownExposures,
							onChange: (e) => patch({ knownExposures: e.target.value }),
							placeholder: "Parches, litigios, FX, gente en tránsito, concentración de clientes"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Notas para el briefer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: dossier.notes,
							onChange: (e) => patch({ notes: e.target.value }),
							placeholder: "Cómo lee el CEO. Qué no quiere ver."
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => {
							if (!dossier.companyName.trim()) {
								toast("Ponle nombre a la empresa.");
								return;
							}
							toast("Dossier guardado en este dispositivo.");
							navigate({ to: "/" });
						},
						children: "Guardar y abrir briefing"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => {
							loadSample();
							toast("Dossier de Helios Energía cargado.");
							navigate({ to: "/" });
						},
						children: "Cargar ejemplo Helios"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => {
						resetAll();
						navigate({ to: "/" });
					},
					children: "Borrar todo"
				})]
			})
		]
	});
}
function DossierPage() {
	const dossier = useBriefStore((s) => s.dossier);
	const hydrated = useBriefStore((s) => s.hydrated);
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		if (hydrated && !dossier) navigate({ to: "/" });
	}, [
		hydrated,
		dossier,
		navigate
	]);
	if (!dossier) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DossierForm, {});
}
//#endregion
export { DossierPage as component };
