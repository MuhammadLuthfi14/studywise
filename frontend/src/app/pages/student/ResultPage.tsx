import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { GitBranch, History, RefreshCw, Save, Sparkles } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { ResultCard } from "../../components/ResultCard";
import { ResultChart } from "../../components/ResultChart";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { useConsultation } from "../../context/ConsultationContext";
import { useAuth } from "../../context/AuthContext";
import { saveConsultation } from "../../services/consultationService";
import { listRules } from "../../services/knowledgeService";
import type { Rule } from "../../types";

export function ResultPage() {
  const { current, markSaved } = useConsultation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [rules, setRules] = useState<Rule[]>([]);

  useEffect(() => {
    listRules().then(setRules).catch(() => {/* rules display bersifat opsional */});
  }, []);

  // Jika tidak ada hasil aktif (mis. akses langsung), kembali ke konsultasi.
  if (!current) return <Navigate to="/app/konsultasi" replace />;

  const { results, activeRules, saved } = current;
  const topResult = results[0];
  const activeRuleObjs = rules.filter((r) => activeRules.includes(r.code));

  async function handleSave() {
    if (!user || saved) return;
    setSaving(true);
    try {
      await saveConsultation({
        user_id: user.id,
        user_nama: user.nama,
        answers: current!.answers,
        active_rules: activeRules,
        results,
      });
      markSaved();
    } catch {
      // simpan gagal — user bisa coba lagi
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hasil Rekomendasi"
        description="Berikut strategi belajar yang paling sesuai dengan kondisimu."
        actions={
          <Button variant="outline" onClick={() => navigate("/app/konsultasi")}>
            <RefreshCw className="size-4" /> Konsultasi Ulang
          </Button>
        }
      />

      {/* Ringkasan */}
      <Card className="overflow-hidden border-none bg-sw-primary text-white">
        <CardContent className="flex flex-col gap-3 p-3 xs:gap-4 xs:p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 size-5 shrink-0 sm:size-6" />
            <div className="min-w-0">
              <div className="text-sm text-white/90">Rekomendasi Utama</div>
              <div className="text-base font-semibold xs:text-lg sm:text-xl">{topResult.recommendation}</div>
              <p className="mt-1 text-sm text-white/90">{topResult.reason}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:block sm:text-center">
            <div className="text-3xl font-semibold">{topResult.percentage}%</div>
            <div className="text-sm text-white/90">Nilai Keyakinan</div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-5">
        {/* Daftar rekomendasi */}
        <div className="space-y-3 md:col-span-3">
          <h3>Daftar Rekomendasi</h3>
          {results.map((r, i) => (
            <ResultCard key={r.recommendation_code} rank={i + 1} result={r} />
          ))}
        </div>

        {/* Chart + penjelasan */}
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardContent className="space-y-3 p-4 sm:p-5">
              <h3>Grafik Nilai CF</h3>
              <ResultChart results={results} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-3 p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <GitBranch className="size-4 text-sw-ai" />
                <h3 className="!mb-0">Rule Aktif</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Aturan pakar yang terpicu oleh kondisi belajarmu.
              </p>
              <div className="space-y-2">
                {activeRuleObjs.length > 0 ? (
                  activeRuleObjs.map((r) => (
                    <div
                      key={r.code}
                      className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2 text-sm"
                    >
                      <span className="font-medium">{r.code}</span>
                      <Badge variant="outline" className="text-xs">
                        CF Pakar {r.cf_pakar.toFixed(2)}
                      </Badge>
                    </div>
                  ))
                ) : (
                  activeRules.map((code) => (
                    <div
                      key={code}
                      className="rounded-lg bg-muted/60 px-3 py-2 text-sm font-medium"
                    >
                      {code}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Aksi */}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-3">
        <Button variant="outline" onClick={() => navigate("/app/riwayat")}>
          <History className="size-4" /> Lihat Riwayat
        </Button>
        <Button onClick={handleSave} disabled={saving || saved}>
          <Save className="size-4" />
          {saved ? "Tersimpan" : saving ? "Menyimpan..." : "Simpan Hasil"}
        </Button>
      </div>
    </div>
  );
}
