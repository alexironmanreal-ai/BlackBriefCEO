import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useBriefStore } from "@/lib/store";
import { formatBriefDate, formatShortDate, todayKey } from "@/lib/utils";

export const Route = createFileRoute("/archivo")({ component: ArchivePage });

function ArchivePage() {
  const hydrated = useBriefStore((s) => s.hydrated);
  const dossier = useBriefStore((s) => s.dossier);
  const briefingsMap = useBriefStore((s) => s.briefings);
  const setActiveDate = useBriefStore((s) => s.setActiveDate);
  const navigate = useNavigate();
  const today = todayKey();
  const briefings = useMemo(
    () => Object.values(briefingsMap).sort((a, b) => b.date.localeCompare(a.date)),
    [briefingsMap],
  );

  useEffect(() => {
    if (hydrated && !dossier) {
      void navigate({ to: "/" });
    }
  }, [hydrated, dossier, navigate]);

  if (!dossier) return null;

  return (
    <section>
      <p className="kicker">Histórico</p>
      <h1 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">
        Archivo
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Cada mañana debería ser distinta porque el dossier cambia, no porque
        cambie el titular de portada.
      </p>

      {briefings.length === 0 ? (
        <div className="mt-12 max-w-md">
          <p className="text-sm text-muted-foreground">
            Todavía no hay briefings. El primero queda aquí cuando lo generes.
          </p>
          <Button className="mt-6" asChild>
            <Link to="/">Ir al briefing</Link>
          </Button>
        </div>
      ) : (
        <ul className="mt-10 divide-y divide-border border-t border-border">
          {briefings.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className="flex w-full flex-col gap-2 py-5 text-left transition-colors duration-150 hover:bg-muted/40 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
                onClick={() => {
                  setActiveDate(item.date);
                  void navigate({ to: "/" });
                }}
              >
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">
                    {formatBriefDate(item.date)}
                    {item.date === today ? " · hoy" : ""}
                    {item.source === "referencia" ? " · referencia" : ""}
                  </p>
                  <p className="mt-2 max-w-2xl text-sm leading-snug text-foreground">
                    {item.headline}
                  </p>
                </div>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  {formatShortDate(item.date)} · {String(item.items.length).padStart(2, "0")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
