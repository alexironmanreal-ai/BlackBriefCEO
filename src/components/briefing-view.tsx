import type { ReactNode } from "react";
import { toast } from "sonner";
import { Copy, Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { briefingToPlainText } from "@/lib/briefing-text";
import {
  HORIZON_LABEL,
  SEVERITY_LABEL,
  VECTOR_LABEL,
  type Briefing,
  type Severity,
} from "@/lib/types";
import { cn, formatBriefDate } from "@/lib/utils";

function severityVariant(severity: Severity) {
  return severity;
}

function countBySeverity(briefing: Briefing) {
  return briefing.items.reduce(
    (acc, item) => {
      acc[item.severity] += 1;
      return acc;
    },
    { critico: 0, alto: 0, vigilancia: 0 } as Record<Severity, number>,
  );
}

export function BriefingView({
  briefing,
  actions,
}: {
  briefing: Briefing;
  actions?: ReactNode;
}) {
  const counts = countBySeverity(briefing);

  async function copyText() {
    try {
      await navigator.clipboard.writeText(briefingToPlainText(briefing));
      toast.success("Briefing copiado. Listo para el correo de las 06:30.");
    } catch {
      toast.error("No se pudo copiar. Prueba exportar.");
    }
  }

  return (
    <article className="enter-stagger">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="kicker">
            Confidencial · uso interno · {briefing.source === "vivo" ? "generado" : "referencia"}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            {briefing.companyName}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatBriefDate(briefing.date)}
          </p>
        </div>
        <div className="no-print flex flex-wrap gap-2">{actions}</div>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-2 sm:max-w-md">
        {(
          [
            ["critico", counts.critico],
            ["alto", counts.alto],
            ["vigilancia", counts.vigilancia],
          ] as const
        ).map(([key, n]) => (
          <div
            key={key}
            className="rounded-md border border-border bg-card px-3 py-2.5"
          >
            <p className="kicker text-[0.65rem]">{SEVERITY_LABEL[key]}</p>
            <p className="mt-1 font-display text-2xl tabular-nums leading-none">
              {n}
            </p>
          </div>
        ))}
      </div>

      <h1 className="mt-10 max-w-3xl font-display text-3xl leading-snug tracking-tight sm:text-4xl">
        {briefing.headline}
      </h1>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
        {briefing.situation}
      </p>
      <p className="mt-4 text-xs tracking-wide text-muted-foreground">
        {briefing.signalNote}
      </p>

      <div className="mt-12 flex items-end justify-between gap-4">
        <h2 className="kicker">Amenazas mapeadas al dossier</h2>
        <span className="text-xs tabular-nums text-muted-foreground">
          {String(briefing.items.length).padStart(2, "0")}
        </span>
      </div>
      <Separator className="mt-3 bg-rule" />

      <ol className="mt-2">
        {briefing.items.map((item, index) => (
          <li
            key={item.id}
            className="border-b border-border py-8 last:border-b-0"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-display text-lg tabular-nums text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <Badge variant={severityVariant(item.severity)}>
                {SEVERITY_LABEL[item.severity]}
              </Badge>
              <Badge>{VECTOR_LABEL[item.vector]}</Badge>
              <Badge variant="paper">{HORIZON_LABEL[item.horizon]}</Badge>
            </div>
            <h3 className="mt-4 max-w-3xl text-lg font-medium leading-snug tracking-tight">
              {item.title}
            </h3>
            <p className="mt-2 text-xs tracking-wide text-muted-foreground">
              Ancla · {item.dossierAnchor}
            </p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="kicker">Por qué te importa</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                  {item.whyItMatters}
                </p>
              </div>
              <div>
                <p className="kicker">Acción</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                  {item.action}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Owner · {item.owner}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>

      {briefing.watchlist.length ? (
        <section className="mt-10">
          <h2 className="kicker">Vigilancia</h2>
          <Separator className="mt-3 bg-rule" />
          <ul className="mt-5 space-y-3">
            {briefing.watchlist.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
              >
                <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-12 rounded-xl bg-card p-5 sm:p-8">
        <h2 className="kicker">Para el CEO</h2>
        <p className="mt-4 max-w-2xl font-display text-xl leading-snug tracking-tight">
          {briefing.close}
        </p>
      </section>

      <div className="no-print mt-8 flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => void copyText()}>
          <Copy />
          Copiar
        </Button>
        <Button variant="ghost" onClick={() => window.print()}>
          <Printer />
          Exportar
        </Button>
      </div>
    </article>
  );
}

export function GenerateBar({
  onGenerate,
  generating,
  label,
  className,
}: {
  onGenerate: () => void;
  generating: boolean;
  label: string;
  className?: string;
}) {
  return (
    <Button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (generating) return;
        onGenerate();
      }}
      disabled={generating}
      className={cn("min-w-44", className)}
    >
      {generating ? "Cruzando el dossier…" : label}
    </Button>
  );
}
