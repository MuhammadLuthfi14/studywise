import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { AlertCircle, RotateCcw, Search, Send } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../../components/PageHeader";
import { SymptomCard } from "../../components/SymptomCard";
import { LoadingState } from "../../components/LoadingState";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Progress } from "../../components/ui/progress";
import {
  getSymptoms,
  processConsultation,
} from "../../services/consultationService";
import { useConsultation } from "../../context/ConsultationContext";
import type { ConsultationAnswer, Symptom } from "../../types";

export function ConsultationPage() {
  const navigate = useNavigate();
  const { setCurrent } = useConsultation();

  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [query, setQuery] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    getSymptoms().then((data) => {
      setSymptoms(data);
      setLoading(false);
    });
  }, []);

  const answeredCount = Object.keys(answers).length;
  const progress = symptoms.length
    ? Math.round((answeredCount / symptoms.length) * 100)
    : 0;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return symptoms;
    return symptoms.filter(
      (s) =>
        s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q),
    );
  }, [symptoms, query]);

  function setAnswer(code: string, value: number) {
    setAnswers((prev) => ({ ...prev, [code]: value }));
    setShowWarning(false);
  }

  function reset() {
    setAnswers({});
    setShowWarning(false);
  }

  async function process() {
    if (answeredCount === 0) {
      setShowWarning(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setProcessing(true);
    const payload: ConsultationAnswer[] = Object.entries(answers).map(
      ([symptom_code, cf_user]) => ({ symptom_code, cf_user }),
    );
    try {
      const response = await processConsultation({ answers: payload });
      setCurrent({
        answers: payload,
        results: response.results,
        activeRules: response.active_rules,
        saved: false,
      });
      navigate("/app/konsultasi/hasil");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Gagal memproses rekomendasi. Coba lagi.",
      );
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Konsultasi Belajar"
        description="Pilih tingkat kesesuaian untuk setiap kondisi belajar yang kamu alami."
      />

      {showWarning ? (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>
            Pilih minimal satu kondisi belajar sebelum memproses rekomendasi.
          </AlertDescription>
        </Alert>
      ) : null}

      {/* Progress + pencarian */}
      <Card>
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Terjawab {answeredCount} dari {symptoms.length} kondisi
            </span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <Progress value={progress} />
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Cari kondisi belajar..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <LoadingState rows={5} />
      ) : (
        <div className="grid gap-3">
          {filtered.map((s, i) => (
            <SymptomCard
              key={s.code}
              symptom={s}
              index={i + 1}
              value={answers[s.code] ?? null}
              onChange={(v) => setAnswer(s.code, v)}
            />
          ))}
        </div>
      )}

      {/* Aksi (sticky) */}
      <div className="sticky bottom-0 -mx-4 border-t border-border bg-card/95 p-4 backdrop-blur sm:-mx-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={reset} disabled={answeredCount === 0}>
            <RotateCcw className="size-4" /> Reset Jawaban
          </Button>
          <Button onClick={process} disabled={processing}>
            <Send className="size-4" />
            {processing ? "Memproses..." : "Proses Rekomendasi"}
          </Button>
        </div>
      </div>
    </div>
  );
}
