import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { DossierForm } from "@/components/dossier-form";
import { useBriefStore } from "@/lib/store";

export const Route = createFileRoute("/dossier")({ component: DossierPage });

function DossierPage() {
  const dossier = useBriefStore((s) => s.dossier);
  const hydrated = useBriefStore((s) => s.hydrated);
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrated && !dossier) {
      void navigate({ to: "/" });
    }
  }, [hydrated, dossier, navigate]);

  if (!dossier) return null;
  return <DossierForm />;
}
