import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { cn } from "./ui/utils";

type Accent = "primary" | "ai" | "success";

const accentClass: Record<Accent, string> = {
  primary: "bg-sw-primary/10 text-sw-primary",
  ai: "bg-sw-ai/10 text-sw-ai",
  success: "bg-sw-success/10 text-sw-success",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "primary",
  hint,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: Accent;
  hint?: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-3 xs:gap-4 xs:p-4 sm:p-5">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl xs:size-11 sm:size-12",
            accentClass[accent],
          )}
        >
          <Icon className="size-5 sm:size-6" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-xs text-muted-foreground xs:text-sm">{label}</div>
          <div className="text-xl font-semibold xs:text-2xl">{value}</div>
          {hint ? (
            <div className="truncate text-xs text-muted-foreground">{hint}</div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
