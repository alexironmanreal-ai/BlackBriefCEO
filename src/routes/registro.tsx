import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient, authEnabled } from "@/lib/auth/client";

export const Route = createFileRoute("/registro")({ component: RegistroPage });

function RegistroPage() {
  const navigate = useNavigate();
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
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
      const display = company.trim()
        ? `${name.trim() || "CEO"} · ${company.trim()}`
        : name.trim() || email.trim();
      const result = await authClient.signUp.email({
        email: email.trim(),
        password,
        name: display,
      });
      if (result.error) {
        toast.error(result.error.message || "No se pudo registrar.");
        return;
      }
      toast.success("Empresa registrada. Definí el dossier.");
      void navigate({ to: "/dossier" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error de registro.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="enter-stagger mx-auto max-w-md pt-4 sm:pt-12">
      <p className="kicker">Alta de empresa</p>
      <h1 className="mt-6 font-display text-3xl tracking-tight">Registrar</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Una cuenta por empresa. El dossier y los briefings quedan en memoria
        persistente (base local / servidor).
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="company">Nombre de la empresa</Label>
          <Input
            id="company"
            required
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Helios Energía"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Tu nombre</Label>
          <Input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="María López"
          />
        </div>
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
          <Label htmlFor="password">Contraseña (mín. 8)</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Creando cuenta…" : "Crear cuenta empresa"}
        </Button>
      </form>
      <p className="mt-6 text-sm text-muted-foreground">
        ¿Ya tenés cuenta?{" "}
        <Link to="/login" className="text-foreground underline-offset-4 hover:underline">
          Entrar
        </Link>
      </p>
    </section>
  );
}
