import { cn } from "@/lib/utils";

export function Wordmark({
  className,
  size = "md",
  showText = true,
}: {
  className?: string;
  size?: "sm" | "md";
  showText?: boolean;
}) {
  const iconPx = size === "sm" ? 28 : 36;

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <img
        src="/brand/icon-180.png"
        alt="BRIEF AI"
        width={iconPx}
        height={iconPx}
        className="rounded-md object-cover shadow-sm ring-1 ring-border/60"
        style={{ width: iconPx, height: iconPx }}
      />
      {showText ? (
        <span className="inline-flex items-baseline gap-1.5">
          <span
            className={cn(
              "font-display tracking-tight text-foreground",
              size === "sm" ? "text-base" : "text-lg",
            )}
          >
            BRIEF
          </span>
          <span
            className={cn(
              "font-display tracking-tight text-primary",
              size === "sm" ? "text-base" : "text-lg",
            )}
          >
            AI
          </span>
        </span>
      ) : null}
    </span>
  );
}
