import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Brain,
  ClipboardList,
  ListChecks,
  Lightbulb,
  Server,
  Users,
} from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { StatCard } from "../../components/StatCard";
import { DataTable } from "../../components/DataTable";
import type { Column } from "../../components/DataTable";
import { LoadingState } from "../../components/LoadingState";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { getAllConsultations } from "../../services/consultationService";
import {
  listUsers,
  listSymptoms,
  listRecommendations,
  listRules,
} from "../../services/knowledgeService";
import type { Consultation, User } from "../../types";

export function AdminDashboard() {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [symptomCount, setSymptomCount] = useState(0);
  const [recommendationCount, setRecommendationCount] = useState(0);
  const [ruleCount, setRuleCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      getAllConsultations(),
      listUsers(),
      listSymptoms(),
      listRecommendations(),
      listRules(),
    ])
      .then(([cons, usrs, syms, recs, rls]) => {
        setConsultations(cons);
        setUsers(usrs);
        setSymptomCount(syms.length);
        setRecommendationCount(recs.length);
        setRuleCount(rls.length);
      })
      .catch(() => setError("Gagal memuat data dashboard. Silakan muat ulang halaman."))
      .finally(() => setLoading(false));
  }, []);

  const tableColumns: Column<Consultation>[] = [
    { key: "user", header: "Mahasiswa", render: (r) => r.user_nama },
    {
      key: "date",
      header: "Tanggal",
      render: (r) =>
        new Date(r.created_at).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    },
    {
      key: "rec",
      header: "Rekomendasi Utama",
      render: (r) => r.results[0]?.recommendation ?? "-",
    },
    {
      key: "cf",
      header: "CF Tertinggi",
      render: (r) => (
        <span className="font-semibold text-sw-ai">
          {r.results.length ? Math.max(...r.results.map((x) => x.percentage)) : 0}%
        </span>
      ),
    },
  ];

  const statusItems = [
    { label: "Basis Pengetahuan", value: "Aktif", short: "Aktif" },
    { label: "Mesin Inferensi", value: "Forward Chaining", short: "Fwd Chaining" },
    { label: "Metode Keyakinan", value: "Certainty Factor", short: "CF" },
  ];

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      <PageHeader
        title="Beranda Admin"
        description="Ringkasan sistem pakar StudyWise."
      />

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {loading ? (
        <LoadingState rows={3} />
      ) : (
        <>
          {/* Statistik */}
          <div className="grid gap-3 xs:grid-cols-2 xs:gap-4 md:grid-cols-3 lg:grid-cols-5">
            <StatCard label="Total Gejala" value={symptomCount} icon={ListChecks} accent="primary" />
            <StatCard label="Total Rekomendasi" value={recommendationCount} icon={Lightbulb} accent="ai" />
            <StatCard label="Total Rule" value={ruleCount} icon={Brain} accent="success" />
            <StatCard label="Total Konsultasi" value={consultations.length} icon={ClipboardList} accent="primary" />
            <StatCard label="Total Pengguna" value={users.length} icon={Users} accent="ai" />
          </div>

          <div className="grid gap-4 sm:gap-5 md:grid-cols-3 lg:gap-6">

            {/* ── Konsultasi Terbaru ── */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="!mb-0 truncate">Konsultasi Terbaru</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0"
                  onClick={() => navigate("/admin/konsultasi")}
                >
                  Lihat Semua
                </Button>
              </div>

              {consultations.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center text-sm text-muted-foreground">
                    Belum ada konsultasi.
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Mobile card list — < 640px */}
                  <div className="space-y-2 sm:hidden">
                    {consultations.slice(0, 5).map((c) => {
                      const cf = c.results.length
                        ? Math.max(...c.results.map((x) => x.percentage))
                        : 0;
                      return (
                        <Card key={c.id}>
                          <CardContent className="p-3 xs:p-4">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="truncate font-medium text-sm">{c.user_nama}</p>
                                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                  {c.results[0]?.recommendation ?? "-"}
                                </p>
                              </div>
                              <div className="shrink-0 text-right">
                                <span className="font-semibold text-sm text-sw-ai">{cf}%</span>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(c.created_at).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                  })}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Desktop table — ≥ 640px */}
                  <div className="hidden sm:block">
                    <DataTable
                      columns={tableColumns}
                      data={consultations.slice(0, 5)}
                      rowKey={(r) => r.id}
                      emptyTitle="Belum ada konsultasi"
                    />
                  </div>
                </>
              )}
            </div>

            {/* ── Status Sistem ── */}
            <div>
              <Card className="h-full">
                <CardContent className="space-y-0 p-3 xs:p-4 sm:p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <Server className="size-4 text-sw-success" />
                    <h3 className="!mb-0">Status Sistem</h3>
                  </div>

                  <div className="divide-y divide-border">
                    {statusItems.map((s) => (
                      <div key={s.label} className="py-2.5 first:pt-0 last:pb-0">
                        {/* ≥ 480px: satu baris */}
                        <div className="hidden items-center justify-between gap-2 text-sm xs:flex">
                          <span className="text-muted-foreground">{s.label}</span>
                          <Badge className="shrink-0 border-transparent bg-sw-success/15 text-xs text-sw-success hover:bg-sw-success/15">
                            {s.value}
                          </Badge>
                        </div>
                        {/* < 360px: stack vertikal */}
                        <div className="xs:hidden">
                          <p className="text-xs text-muted-foreground">{s.label}</p>
                          <Badge className="mt-1 border-transparent bg-sw-success/15 text-xs text-sw-success hover:bg-sw-success/15">
                            {s.short}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Indicator dot — aktif */}
                  <div className="mt-3 flex items-center gap-1.5 pt-3 border-t border-border">
                    <span className="size-2 rounded-full bg-sw-success" />
                    <span className="text-xs text-muted-foreground">Semua sistem berjalan normal</span>
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
