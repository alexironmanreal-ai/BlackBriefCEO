import type { Dossier } from "./types";

export function dossierScore(dossier: Dossier): { filled: number; total: number } {
  const checks = [
    dossier.companyName.trim(),
    dossier.sector.trim(),
    dossier.hq.trim(),
    dossier.geographies.some((g) => g.trim()),
    dossier.executives.some((e) => e.name.trim()),
    dossier.assets.some((a) => a.name.trim()),
    dossier.supplyChain.some((s) => s.trim()) || dossier.competitors.some((c) => c.trim()),
    dossier.priorities.trim() || dossier.knownExposures.trim(),
  ];
  return { filled: checks.filter(Boolean).length, total: checks.length };
}
