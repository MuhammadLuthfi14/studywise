import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  BookOpen,
  GaugeCircle,
  History,
  ListChecks,
  Sparkles,
  UserCircle,
} from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { StatCard } from "../../components/StatCard";
import { QuickActionCard } from "../../components/QuickActionCard";
import { LoadingState } from "../../components/LoadingState";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Alert,
  AlertDescription,
} from "../../components/ui/alert";
import { useAuth } from "../../context/AuthContext";
import { getHistory } from "../../services/consultationService";
import type { Consultation } from "../../types";
import { formatDateTimeWib } from "../../utils/format";

export function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    getHistory(user.id)
      .then(setHistory)
      .catch(() =>
        setError(
          "Gagal memuat data konsultasi. Silakan muat ulang halaman.",
        ),
      )
      .finally(() => setLoading(false));
  }, [user]);

  const last = history[0];
  const topResult = last?.results[0];
  const highestCf = last
    ? Math.max(...last.results.map((r) => r.percentage))
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Halo, ${user?.nama?.split(" ")[0] ?? "Mahasiswa"}!`}
        description="Selamat datang kembali di StudyWise. Yuk, temukan strategi belajar terbaikmu."
        actions={
          <Button onClick={() => navigate("/app/konsultasi")}>
            <BookOpen className="size-4" /> Mulai Konsultasi
          </Button>
        }
      />

      {/* Banner edukasi */}
      <Card className="overflow-hidden border-none bg-sw-primary text-white">
        
      </Card>

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
          <div className="grid gap-3 xs:grid-cols-2 xs:gap-4 md:grid-cols-3">
            <StatCard
              label="Total Konsultasi"
              value={history.length}
              icon={ListChecks}
              accent="primary"
            />
            <StatCard
              label="Rekomendasi Terakhir"
              value={
                topResult ? topResult.recommendation_code : "-"
              }
              hint={topResult?.recommendation}
              icon={History}
              accent="ai"
            />
            <StatCard
              label="Keyakinan Tertinggi"
              value={highestCf ? `${highestCf}%` : "-"}
              icon={GaugeCircle}
              accent="success"
            />
          </div>

          {/* Konsultasi terakhir */}
          <div>
            <h3 className="mb-3">Konsultasi Terakhir</h3>
            {last ? (
              <Card>
                <CardContent className="space-y-4 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge variant="outline">
                      {formatDateTimeWib(last.created_at, "compact")}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        navigate(`/app/riwayat/${last.id}`)
                      }
                    >
                      Lihat Detail
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {last.results.slice(0, 3).map((r, i) => (
                      <div
                        key={r.recommendation_code}
                        className="space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-sm">
                          <span>
                            {i + 1}. {r.recommendation}
                          </span>
                          <span className="font-semibold">
                            {r.percentage}%
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-sw-ai"
                            style={{
                              width: `${r.percentage}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
                  <p className="text-muted-foreground">
                    Kamu belum pernah melakukan konsultasi.
                  </p>
                  <Button
                    onClick={() => navigate("/app/konsultasi")}
                  >
                    Mulai Konsultasi Pertama
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Akses cepat */}
        </>
      )}
    </div>
  );
}
