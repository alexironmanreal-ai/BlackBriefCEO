import { createFileRoute, Link } from "@tanstack/react-router";
import { BriefingView, GenerateBar } from "@/components/briefing-view";
import { GeneratingState } from "@/components/generating-state";
import { Onboarding } from "@/components/onboarding";
import { Button } from "@/components/ui/button";
import { runGenerate } from "@/lib/run-generate";
import { useBriefStore } from "@/lib/store";
import { todayKey } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

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
  if (!dossier) return <Onboarding />;

  if (generating) {
    return <GeneratingState companyName={dossier.companyName || "la empresa"} />;
  }

  if (!briefing) {
    return (
      <section className="enter-stagger max-w-2xl pt-2">
        <p className="kicker">Listo cuando el dossier lo esté</p>
        <h1 className="mt-5 font-display text-3xl tracking-tight sm:text-4xl">
          El briefing de {dossier.companyName || "hoy"} aún no existe.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
          No vamos a rellenar esto con titulares. Cuando lo pidas, cada amenaza
          tiene que apuntar a un activo, una persona o un contrato de este
          dossier.
        </p>
        {generateError ? (
          <p className="mt-5 text-sm text-destructive">{generateError}</p>
        ) : null}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <GenerateBar
            generating={generating}
            onGenerate={() => void runGenerate()}
            label="Generar briefing de esta mañana"
          />
          <Button variant="outline" asChild>
            <Link to="/dossier">Revisar dossier</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <div>
      {viewingPast ? (
        <div className="no-print mb-8 flex flex-wrap items-center justify-between gap-3 rounded-md bg-card px-4 py-3 text-sm">
          <p className="text-muted-foreground">Estás leyendo un briefing anterior.</p>
          <Button variant="outline" size="sm" onClick={() => setActiveDate(today)}>
            Volver a hoy
          </Button>
        </div>
      ) : null}
      {generateError ? (
        <p className="mb-6 text-sm text-destructive">{generateError}</p>
      ) : null}
      <BriefingView
        briefing={briefing}
        actions={
          <GenerateBar
            generating={generating}
            onGenerate={() => void runGenerate()}
            label={
              briefing.source === "referencia"
                ? "Generar briefing de esta mañana"
                : "Regenerar el de hoy"
            }
          />
        }
      />
    </div>
  );
}
