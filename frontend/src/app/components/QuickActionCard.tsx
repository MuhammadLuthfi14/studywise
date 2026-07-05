import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { cn } from "./ui/utils";

type Accent = "primary" | "ai" | "success";

const accentClass: Record<Accent, string> = {
  primary: "bg-sw-primary/10 text-sw-primary",
  ai: "bg-sw-ai/10 text-sw-ai",
  success: "bg-sw-success/10 text-sw-success",
};

// Kartu akses cepat yang dapat diklik (navigasi).
export function QuickActionCard({
  title,
  description,
  icon: Icon,
  accent = "primary",
  onClick,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  accent?: Accent;
  onClick?: () => void;
}) {
  return (
    <Card
      onClick={onClick}
      className="group cursor-pointer transition-all hover:border-sw-primary/40 hover:shadow-md"
    >
      <CardContent className="flex items-start gap-4 p-5">
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl",
            accentClass[accent],
          )}
        >
          <Icon className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-medium">{title}</div>
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        </div>
        <ArrowRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-sw-primary" />
      </CardContent>
    </Card>
  );
}
