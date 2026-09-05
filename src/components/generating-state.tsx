import { Skeleton } from "@/components/ui/skeleton";

const LINES = [
  "Leyendo activos, no titulares.",
  "Descartando lo que no toca el dossier.",
  "Anclando cada amenaza a un nombre propio.",
];

export function GeneratingState({ companyName }: { companyName: string }) {
  return (
    <section className="enter-stagger max-w-2xl pt-4">
      <p className="kicker">06:30 · {companyName}</p>
      <h1 className="mt-6 font-display text-3xl tracking-tight">
        Cruzando el dossier con el entorno.
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        No se está resumiendo internet. Se está preguntando qué, de todo lo que
        se mueve, le importa a esta empresa.
      </p>
      <ul className="mt-8 space-y-3">
        {LINES.map((line) => (
          <li key={line} className="text-sm text-muted-foreground">
            {line}
          </li>
        ))}
      </ul>
      <div className="mt-10 space-y-3">
        <Skeleton className="h-8 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="mt-8 h-24 w-full rounded-md" />
        <Skeleton className="h-24 w-full rounded-md" />
      </div>
    </section>
  );
}
