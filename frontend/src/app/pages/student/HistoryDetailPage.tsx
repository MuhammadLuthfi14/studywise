import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, GitBranch } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { ResultCard } from "../../components/ResultCard";
import { ResultChart } from "../../components/ResultChart";
import { LoadingState } from "../../components/LoadingState";
import { EmptyState } from "../../components/EmptyState";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { getConsultation, getSymptoms } from "../../services/consultationService";
import { listRules } from "../../services/knowledgeService";
import type { Consultation, Rule, Symptom } from "../../types";
import { formatDateTimeWib } from "../../utils/format";

// Skala kesesuaian CF — data statis konfigurasi, tidak bergantung backend.
const SCALE = [
  { label: "Tidak Sesuai", value: 0.0 },
  { label: "Kurang Sesuai", value: 0.25 },
  { label: "Cukup Sesuai", value: 0.5 },
  { label: "Sesuai", value: 0.75 },
  { label: "Sangat Sesuai", value: 1.0 },
];

function scaleLabel(value: number): string {
  return SCALE.find((s) => s.value === value)?.label ?? value.toFixed(2);
}

export function HistoryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<Consultation | null>(null);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      getConsultation(id),
      getSymptoms(),
      listRules(),
    ]).then(([consultation, syms, rls]) => {
      setData(consultation ?? null);
      setSymptoms(syms);
      setRules(rls);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <LoadingState rows={5} />;

  if (!data) {
    return (
      <div className="space-y-6">
        <PageHeader title="Detail Riwayat" />
        <EmptyState
          title="Riwayat tidak ditemukan"
          description="Data konsultasi yang kamu cari tidak tersedia."
          action={
            <Button onClick={() => navigate("/app/riwayat")}>
              Kembali ke Riwayat
            </Button>
          }
        />
      </div>
    );
  }

  const symptomName = (code: string) =>
    symptoms.find((s) => s.code === code)?.name ?? code;

  const activeRuleObjs = rules.filter((r) => data.active_rules.includes(r.code));

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 w-fit"
        onClick={() => navigate("/app/riwayat")}
      >
        <ArrowLeft className="size-4" /> Kembali ke Riwayat
      </Button>

      <PageHeader
        title="Detail Konsultasi"
        description={formatDateTimeWib(data.created_at, "detail")}
      />

      <div className="grid gap-6 md:grid-cols-5">
        {/* Jawaban gejala */}
        <div className="md:col-span-2">
          <Card>
            <CardContent className="space-y-3 p-4 sm:p-5">
              <h3>Kondisi yang Dipilih</h3>
              <div className="space-y-2">
                {data.answers.map((a) => (
                  <div
                    key={a.symptom_code}
                    className="flex items-start justify-between gap-3 rounded-lg bg-muted/60 px-3 py-2 text-sm"
                  >
                    <div>
                      <div className="font-medium">{symptomName(a.symptom_code)}</div>
                      <span className="text-xs text-muted-foreground">
                        {a.symptom_code}
                      </span>
                    </div>
                    <Badge variant="outline" className="shrink-0 text-xs">
                      {scaleLabel(a.cf_user)} ({a.cf_user.toFixed(2)})
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rule aktif + chart */}
        <div className="space-y-6 md:col-span-3">
          <Card>
            <CardContent className="space-y-3 p-4 sm:p-5">
              <h3>Grafik Nilai CF</h3>
              <ResultChart results={data.results} />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-3 p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <GitBranch className="size-4 text-sw-ai" />
                <h3 className="!mb-0">Rule Aktif</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeRuleObjs.map((r) => (
                  <Badge key={r.code} variant="outline">
                    {r.code} · CF {r.cf_pakar.toFixed(2)}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Rekomendasi akhir */}
      <div className="space-y-3">
        <h3>Rekomendasi Akhir</h3>
        {data.results.map((r, i) => (
          <ResultCard key={r.recommendation_code} rank={i + 1} result={r} />
        ))}
      </div>
    </div>
  );
}
