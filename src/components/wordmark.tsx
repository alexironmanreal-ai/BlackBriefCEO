import { cn } from "@/lib/utils";

export function Wordmark({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span
        className={cn(
          "font-display tracking-tight text-foreground",
          size === "sm" ? "text-lg" : "text-xl",
        )}
      >
        BlackBrief
      </span>
      <span className="kicker text-muted-foreground">CEO</span>
    </span>
  );
}
