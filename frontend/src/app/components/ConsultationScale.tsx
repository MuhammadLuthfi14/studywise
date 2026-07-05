import { consultationScale } from "../utils/constants";
import { cn } from "./ui/utils";

// Pilihan skala kesesuaian (5 tingkat) untuk satu gejala.
// Label ditonjolkan, nilai numerik ditampilkan sebagai teks pendukung.
export function ConsultationScale({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (value: number) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-1 sm:gap-2">
      {consultationScale.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.label}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            aria-label={`${opt.label} (Nilai CF ${opt.value.toFixed(2)})`}
            title={`Nilai CF: ${opt.value.toFixed(2)}`}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-lg border px-1.5 py-2 text-center transition-all sm:px-2",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sw-primary focus-visible:ring-offset-1",
              active
                ? "border-sw-primary bg-sw-primary/10 text-sw-primary ring-1 ring-sw-primary"
                : "border-border bg-card text-foreground hover:border-sw-primary/40 hover:bg-muted",
            )}
          >
            <span className="text-xs font-medium leading-tight sm:text-sm">
              {opt.label}
            </span>
            <span className="text-xs text-muted-foreground">
              {opt.value.toFixed(2)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
