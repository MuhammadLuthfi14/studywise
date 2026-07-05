// Menyimpan hasil konsultasi terakhir (sementara) agar dapat dibagikan
// antara halaman Konsultasi dan halaman Hasil Rekomendasi.

import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { ConsultationAnswer, RecommendationResult } from "../types";

interface ActiveConsultation {
  answers: ConsultationAnswer[];
  results: RecommendationResult[];
  activeRules: string[];
  saved: boolean;
}

interface ConsultationContextValue {
  current: ActiveConsultation | null;
  setCurrent: (data: ActiveConsultation | null) => void;
  markSaved: () => void;
}

const ConsultationContext = createContext<ConsultationContextValue | undefined>(
  undefined,
);

export function ConsultationProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<ActiveConsultation | null>(null);

  const value = useMemo<ConsultationContextValue>(
    () => ({
      current,
      setCurrent,
      markSaved: () =>
        setCurrent((prev) => (prev ? { ...prev, saved: true } : prev)),
    }),
    [current],
  );

  return (
    <ConsultationContext.Provider value={value}>
      {children}
    </ConsultationContext.Provider>
  );
}

export function useConsultation(): ConsultationContextValue {
  const ctx = useContext(ConsultationContext);
  if (!ctx)
    throw new Error("useConsultation harus dipakai di dalam ConsultationProvider");
  return ctx;
}
