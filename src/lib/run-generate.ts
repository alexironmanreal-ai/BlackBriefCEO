import { generateBriefing } from "@/lib/generate-briefing";
import { useBriefStore } from "@/lib/store";
import { todayKey } from "@/lib/utils";

export async function runGenerate(): Promise<boolean> {
  const state = useBriefStore.getState();
  const dossier = state.dossier;
  if (!dossier?.companyName.trim()) {
    state.setGenerateError("Define la empresa en el dossier antes de generar.");
    return false;
  }

  state.setGenerating(true);
  state.setGenerateError(null);
  const date = todayKey();
  const previousHeadlines = Object.values(state.briefings)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 8)
    .flatMap((b) => [b.headline, ...b.items.map((i) => i.title)])
    .slice(0, 12);

  try {
    const result = await generateBriefing({
      data: { date, dossier, previousHeadlines },
    });
    if (!result.ok) {
      useBriefStore.getState().setGenerateError(result.error);
      return false;
    }
    useBriefStore.getState().saveBriefing(result.briefing);
    return true;
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "No se pudo generar el briefing. Inténtalo de nuevo.";
    useBriefStore.getState().setGenerateError(message);
    return false;
  } finally {
    useBriefStore.getState().setGenerating(false);
  }
}
