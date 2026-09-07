import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient, authEnabled } from "@/lib/auth/client";
import { loadCompanyMemory } from "@/lib/company-memory";
import { useBriefStore } from "@/lib/store";
import { todayKey } from "@/lib/utils";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!authEnabled) {
      toast.error("Auth no está habilitado en este entorno.");
      return;
    }
    setBusy(true);
    try {
      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
      });
      if (result.error) {
        toast.error(result.error.message || "No se pudo iniciar sesión.");
        return;
      }
      try {
        const memory = await loadCompanyMemory();
        if (memory.ok && (memory.dossier || Object.keys(memory.briefings).length)) {
          useBriefStore.setState({
            dossier: memory.dossier,
            briefings: {
              ...useBriefStore.getState().briefings,
              ...memory.briefings,
            },
            activeDate: todayKey(),
          });
        }
      } catch {
        /* offline / first login */
      }
      toast.success("Sesión iniciada.");
      void navigate({ to: "/" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error de acceso.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="enter-stagger mx-auto max-w-md pt-4 sm:pt-12">
      <p className="kicker">Acceso empresa</p>
      <h1 className="mt-6 font-display text-3xl tracking-tight">Entrar</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        El dossier y el archivo quedan ligados a la cuenta de la empresa.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email corporativo</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ceo@empresa.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Entrando…" : "Entrar"}
        </Button>
      </form>
      <p className="mt-6 text-sm text-muted-foreground">
        ¿Primera vez?{" "}
        <Link to="/registro" className="text-foreground underline-offset-4 hover:underline">
          Registrar empresa
        </Link>
      </p>
    </section>
  );
}
