import logoSrc from "../../imports/logo_studywise.png";
import { cn } from "./ui/utils";

export function Logo({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-sm",
        className,
      )}
      style={{ width: size, height: size }}
      aria-label="Logo StudyWise"
    >
      <img
        src={logoSrc}
        alt="StudyWise"
        className="h-full w-full object-contain"
        draggable={false}
      />
    </div>
  );
}

export function BrandMark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Logo size={36} />
      <div className="leading-tight">
        <div className="font-semibold text-sw-primary">StudyWise</div>
        <div className="text-xs text-muted-foreground">Sistem Pakar Strategi Belajar</div>
      </div>
    </div>
  );
}
