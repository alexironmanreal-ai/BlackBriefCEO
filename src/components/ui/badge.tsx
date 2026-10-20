import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground border border-border/50",
        critico: "bg-destructive/12 text-destructive border border-destructive/25",
        alto: "bg-high/12 text-high border border-high/25",
        vigilancia: "bg-watch/12 text-watch border border-watch/25",
        paper: "bg-primary/10 text-primary border border-primary/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
