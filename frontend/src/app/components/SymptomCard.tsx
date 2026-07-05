import { Card, CardContent } from "./ui/card";
import { ConsultationScale } from "./ConsultationScale";
import type { Symptom } from "../types";
import { cn } from "./ui/utils";

// Kartu satu gejala beserta skala kesesuaiannya.
export function SymptomCard({
  symptom,
  index,
  value,
  onChange,
}: {
  symptom: Symptom;
  index: number;
  value: number | null;
  onChange: (value: number) => void;
}) {
  const answered = value !== null;
  return (
    <Card
      className={cn(
        "transition-colors",
        answered ? "border-sw-primary/40" : "",
      )}
    >
      <CardContent className="space-y-3 p-3 xs:p-4">
        <div className="flex items-start gap-2 xs:gap-3">
          <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground xs:size-7">
            {index}
          </span>
          <div className="flex-1">
            <p className="font-medium leading-snug">{symptom.name}</p>
            <span className="text-xs text-muted-foreground">{symptom.code}</span>
          </div>
        </div>
        <ConsultationScale value={value} onChange={onChange} />
      </CardContent>
    </Card>
  );
}
