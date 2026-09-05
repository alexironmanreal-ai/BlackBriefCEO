import {
  HORIZON_LABEL,
  SEVERITY_LABEL,
  VECTOR_LABEL,
  type Briefing,
} from "./types";
import { formatBriefDate } from "./utils";

export function briefingToPlainText(briefing: Briefing): string {
  const lines: string[] = [
    "BLACKBRIEF CEO — USO INTERNO",
    briefing.companyName.toUpperCase(),
    formatBriefDate(briefing.date),
    "",
    briefing.headline,
    "",
    briefing.situation,
    "",
    "AMENAZAS MAPEADAS AL DOSSIER",
    "",
  ];

  briefing.items.forEach((item, index) => {
    const n = String(index + 1).padStart(2, "0");
    lines.push(
      `${n}. ${SEVERITY_LABEL[item.severity].toUpperCase()} · ${VECTOR_LABEL[item.vector]} · ${HORIZON_LABEL[item.horizon]}`,
    );
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
