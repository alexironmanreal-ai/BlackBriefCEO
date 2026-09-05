export type Severity = "critico" | "alto" | "vigilancia";

export type Vector =
  | "cibernetico"
  | "geopolitico"
  | "regulatorio"
  | "reputacional"
  | "suministro"
  | "fisico"
  | "financiero"
  | "personal"
  | "operacional";

export type Horizon = "hoy" | "7d" | "30d";

export interface Executive {
  name: string;
  role: string;
}

export interface CriticalAsset {
  name: string;
  type: string;
  location: string;
  note: string;
}

export interface Dossier {
  companyName: string;
  legalName: string;
  sector: string;
  hq: string;
  size: string;
  geographies: string[];
  executives: Executive[];
  assets: CriticalAsset[];
  supplyChain: string[];
  competitors: string[];
  regulatory: string;
  priorities: string;
  knownExposures: string;
  notes: string;
}

export interface ThreatItem {
  id: string;
  severity: Severity;
  vector: Vector;
  horizon: Horizon;
  title: string;
  dossierAnchor: string;
  whyItMatters: string;
  action: string;
  owner: string;
}

export interface Briefing {
  id: string;
  date: string;
  generatedAt: string;
  source: "referencia" | "vivo";
  companyName: string;
  headline: string;
  situation: string;
  items: ThreatItem[];
  watchlist: string[];
  close: string;
  signalNote: string;
}

export const EMPTY_DOSSIER: Dossier = {
  companyName: "",
  legalName: "",
  sector: "",
  hq: "",
  size: "",
  geographies: [],
  executives: [{ name: "", role: "CEO" }],
  assets: [{ name: "", type: "", location: "", note: "" }],
  supplyChain: [],
  competitors: [],
  regulatory: "",
  priorities: "",
  knownExposures: "",
  notes: "",
};

export const VECTOR_LABEL: Record<Vector, string> = {
  cibernetico: "Cibernético",
  geopolitico: "Geopolítico",
  regulatorio: "Regulatorio",
  reputacional: "Reputacional",
  suministro: "Cadena de suministro",
  fisico: "Físico",
  financiero: "Financiero",
  personal: "Personas",
  operacional: "Operacional",
};

export const SEVERITY_LABEL: Record<Severity, string> = {
  critico: "Crítico",
  alto: "Alto",
  vigilancia: "Vigilancia",
};

export const HORIZON_LABEL: Record<Horizon, string> = {
  hoy: "Hoy",
  "7d": "7 días",
  "30d": "30 días",
};
