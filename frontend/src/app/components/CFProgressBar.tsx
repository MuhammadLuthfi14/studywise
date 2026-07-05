import { cn } from "./ui/utils";

type Tone = "primary" | "ai" | "success";

const toneClass: Record<Tone, string> = {
  primary: "bg-sw-primary",
  ai: "bg-sw-ai",
  success: "bg-sw-success",
};

// Progress bar nilai Certainty Factor dengan label persentase.
export function CFProgressBar({
  percentage,
  tone = "ai",
  showLabel = true,
  className,
}: {
  percentage: number;
  tone?: Tone;
  showLabel?: boolean;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, percentage));
  return (
    <div className={cn("space-y-1", className)}>
      {showLabel ? (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Nilai Keyakinan (CF)</span>
          <span className="font-semibold">{clamped}%</span>
        </div>
      ) : null}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all", toneClass[tone])}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
