import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { Wordmark } from "@/components/wordmark";
import { useBriefStore } from "@/lib/store";
import { cn, todayKey } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Briefing" },
  { to: "/dossier", label: "Dossier" },
  { to: "/archivo", label: "Archivo" },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const dossier = useBriefStore((s) => s.dossier);

  useEffect(() => {
    let unmounted = false;
    let done = false;

    const finish = () => {
      if (unmounted || done) return;
      done = true;
      useBriefStore.setState({ hydrated: true, activeDate: todayKey() });
      setReady(true);
    };

    const persistApi = useBriefStore.persist;
    const unsub = persistApi.onFinishHydration(finish);

    void Promise.resolve(persistApi.rehydrate()).then(finish).catch(finish);

    if (persistApi.hasHydrated()) finish();

    const timeout = window.setTimeout(finish, 80);
    return () => {
      unmounted = true;
      unsub();
      window.clearTimeout(timeout);
    };
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Wordmark />
      </div>
    );
  }

  return (
    <div className="min-h-dvh">
      <header className="no-print sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="min-h-11 min-w-11 content-center">
            <Wordmark size="sm" />
          </Link>
          {dossier ? (
            <nav className="flex items-center gap-1 text-sm">
              {NAV.map((item) => {
                const active =
                  item.to === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "flex h-11 items-center px-3 text-muted-foreground transition-colors duration-150",
                      active && "text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          ) : null}
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {children}
      </main>
      <Toaster
        theme="dark"
        position="bottom-center"
        toastOptions={{
          className:
            "!bg-card !text-foreground !border-border !rounded-md !font-sans",
        }}
      />
    </div>
  );
}
