import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBriefStore } from "@/lib/store";

export function Onboarding() {
  const navigate = useNavigate();
  const loadSample = useBriefStore((s) => s.loadSample);
  const startBlank = useBriefStore((s) => s.startBlank);

  return (
    <section className="enter-stagger mx-auto max-w-2xl pt-4 sm:pt-12">
      <p className="kicker">Uso interno · cada mañana</p>
      <h1 className="mt-8 font-display text-4xl leading-tight tracking-tight text-foreground sm:text-5xl">
        Internet está lleno de amenazas. Casi ninguna es tuya.
      </h1>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
        BlackBrief no resume el día. Resume el contexto de una empresa: activos,
        personas, contratos, geografía. Cada ítem del briefing de las 06:30
        tiene ancla en el dossier o no entra.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button
          size="lg"
          onClick={() => {
            loadSample();
            void navigate({ to: "/" });
          }}
        >
          Ver Helios Energía
          <ArrowRight />
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => {
            startBlank();
            void navigate({ to: "/dossier" });
          }}
        >
          <FileText />
          Definir mi empresa
        </Button>
      </div>
      <p className="mt-8 max-w-md text-xs leading-relaxed text-muted-foreground">
        Helios es un dossier de referencia — generación renovable en Chile y
        Perú, pre-IPO, un PPA que pesa el 18% del EBITDA. Sirve para entender el
        producto antes de cargar el tuyo.
      </p>
    </section>
  );
}
