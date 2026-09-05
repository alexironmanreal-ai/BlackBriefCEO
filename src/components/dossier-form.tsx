import type { ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/components/tag-input";
import { dossierScore } from "@/lib/dossier-score";
import { useBriefStore } from "@/lib/store";
import type { CriticalAsset, Dossier, Executive } from "@/lib/types";

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <Label>{label}</Label>
      {children}
    </label>
  );
}

function Section({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl bg-card p-5 sm:p-7">
      <p className="kicker">{kicker}</p>
      <h2 className="mt-2 font-display text-2xl tracking-tight">{title}</h2>
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}

function currentDossier(): Dossier | null {
  return useBriefStore.getState().dossier;
}

export function DossierForm() {
  const navigate = useNavigate();
  const dossier = useBriefStore((s) => s.dossier);
  const setDossier = useBriefStore((s) => s.setDossier);
  const loadSample = useBriefStore((s) => s.loadSample);
  const resetAll = useBriefStore((s) => s.resetAll);

  if (!dossier) return null;

  const score = dossierScore(dossier);

  function patch(partial: Partial<Dossier>) {
    const latest = currentDossier();
    if (!latest) return;
    setDossier({ ...latest, ...partial });
  }

  function setExecutive(index: number, next: Executive) {
    const latest = currentDossier();
    if (!latest) return;
    patch({
      executives: latest.executives.map((row, i) => (i === index ? next : row)),
    });
  }

  function setAsset(index: number, next: CriticalAsset) {
    const latest = currentDossier();
    if (!latest) return;
    patch({
      assets: latest.assets.map((row, i) => (i === index ? next : row)),
    });
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="kicker">El briefing es tan bueno como esto</p>
          <h1 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">
            Dossier
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Nombres, plantas, contratos, gente. Sin esto, cualquier resumen es
            periodismo.
          </p>
        </div>
        <p className="text-xs tabular-nums text-muted-foreground">
          {score.filled}/{score.total} campos ancla
        </p>
      </header>

      <Section kicker="01" title="Identidad">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Empresa">
            <Input
              value={dossier.companyName}
              onChange={(e) => patch({ companyName: e.target.value })}
              placeholder="Helios Energía"
            />
          </Field>
          <Field label="Razón social">
            <Input
              value={dossier.legalName}
              onChange={(e) => patch({ legalName: e.target.value })}
              placeholder="Helios Energía SpA"
            />
          </Field>
          <Field label="Sector">
            <Input
              value={dossier.sector}
              onChange={(e) => patch({ sector: e.target.value })}
              placeholder="Generación renovable"
            />
          </Field>
          <Field label="Sede">
            <Input
              value={dossier.hq}
              onChange={(e) => patch({ hq: e.target.value })}
              placeholder="Santiago, Chile"
            />
          </Field>
        </div>
        <Field label="Escala">
          <Input
            value={dossier.size}
            onChange={(e) => patch({ size: e.target.value })}
            placeholder="Personas, MW, ingresos, plantas"
          />
        </Field>
      </Section>

      <Section kicker="02" title="Teatro de operaciones">
        <Field label="Geografías">
          <TagInput
            values={dossier.geographies}
            onChange={(geographies) => patch({ geographies })}
            placeholder="Escribe y pulsa Enter"
          />
        </Field>
        <Field label="Competidores">
          <TagInput
            values={dossier.competitors}
            onChange={(competitors) => patch({ competitors })}
            placeholder="Quién puede mover tu precio o tu gente"
          />
        </Field>
        <Field label="Marco regulatorio">
          <Textarea
            value={dossier.regulatory}
            onChange={(e) => patch({ regulatory: e.target.value })}
            placeholder="Permisos, supervisores, listings"
          />
        </Field>
      </Section>

      <Section kicker="03" title="Personas">
        <div className="space-y-3">
          {dossier.executives.map((row, index) => (
            <div key={index} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
              <Input
                value={row.name}
                onChange={(e) => setExecutive(index, { ...row, name: e.target.value })}
                placeholder="Nombre"
                aria-label="Nombre del ejecutivo"
              />
              <Input
                value={row.role}
                onChange={(e) => setExecutive(index, { ...row, role: e.target.value })}
                placeholder="Rol"
                aria-label="Rol"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="justify-self-end"
                onClick={() => {
                  const latest = currentDossier();
                  if (!latest) return;
                  patch({
                    executives: latest.executives.filter((_, i) => i !== index),
                  });
                }}
                aria-label="Quitar ejecutivo"
              >
                <Trash2 />
              </Button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const latest = currentDossier();
            if (!latest) return;
            patch({
              executives: [...latest.executives, { name: "", role: "" }],
            });
          }}
        >
          <Plus />
          Añadir persona
        </Button>
      </Section>

      <Section kicker="04" title="Activos críticos">
        <div className="space-y-6">
          {dossier.assets.map((row, index) => (
            <div
              key={index}
              className="space-y-3 rounded-md bg-background p-4"
            >
              <div className="grid gap-2 sm:grid-cols-3">
                <Input
                  value={row.name}
                  onChange={(e) => setAsset(index, { ...row, name: e.target.value })}
                  placeholder="Nombre del activo"
                />
                <Input
                  value={row.type}
                  onChange={(e) => setAsset(index, { ...row, type: e.target.value })}
                  placeholder="Tipo"
                />
                <Input
                  value={row.location}
                  onChange={(e) =>
                    setAsset(index, { ...row, location: e.target.value })
                  }
                  placeholder="Ubicación"
                />
              </div>
              <Textarea
                value={row.note}
                onChange={(e) => setAsset(index, { ...row, note: e.target.value })}
                placeholder="Por qué es crítico: dependencia, contrato, fallo único"
                className="min-h-20"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const latest = currentDossier();
                  if (!latest) return;
                  patch({
                    assets: latest.assets.filter((_, i) => i !== index),
                  });
                }}
              >
                <Trash2 />
                Quitar activo
              </Button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const latest = currentDossier();
            if (!latest) return;
            patch({
              assets: [
                ...latest.assets,
                { name: "", type: "", location: "", note: "" },
              ],
            });
          }}
        >
          <Plus />
          Añadir activo
        </Button>
      </Section>

      <Section kicker="05" title="Dependencias y exposición">
        <Field label="Cadena de suministro">
          <TagInput
            values={dossier.supplyChain}
            onChange={(supplyChain) => patch({ supplyChain })}
            placeholder="Proveedor, banco, EPC, tecnología"
          />
        </Field>
        <Field label="Prioridades de este trimestre">
          <Textarea
            value={dossier.priorities}
            onChange={(e) => patch({ priorities: e.target.value })}
            placeholder="Qué no puede fallar en los próximos 90 días"
          />
        </Field>
        <Field label="Exposiciones ya conocidas">
          <Textarea
            value={dossier.knownExposures}
            onChange={(e) => patch({ knownExposures: e.target.value })}
            placeholder="Parches, litigios, FX, gente en tránsito, concentración de clientes"
          />
        </Field>
        <Field label="Notas para el briefer">
          <Textarea
            value={dossier.notes}
            onChange={(e) => patch({ notes: e.target.value })}
            placeholder="Cómo lee el CEO. Qué no quiere ver."
          />
        </Field>
      </Section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => {
              const latest = currentDossier();
              if (!latest?.companyName.trim()) {
                toast("Ponle nombre a la empresa.");
                return;
              }
              toast("Dossier guardado en este dispositivo.");
              void navigate({ to: "/" });
            }}
          >
            Guardar y abrir briefing
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              loadSample();
              toast("Dossier de Helios Energía cargado.");
              void navigate({ to: "/" });
            }}
          >
            Cargar ejemplo Helios
          </Button>
        </div>
        <Button
          variant="ghost"
          onClick={() => {
            resetAll();
            void navigate({ to: "/" });
          }}
        >
          Borrar todo
        </Button>
      </div>
    </div>
  );
}
