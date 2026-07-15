import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { BookOpen, Eye } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { DataTable } from "../../components/DataTable";
import type { Column } from "../../components/DataTable";
import { LoadingState } from "../../components/LoadingState";
import { EmptyState } from "../../components/EmptyState";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { useAuth } from "../../context/AuthContext";
import { getHistory } from "../../services/consultationService";
import type { Consultation } from "../../types";
import { formatDateTimeWib } from "../../utils/format";

export function ConsultationHistoryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    getHistory(user.id)
      .then(setData)
      .catch(() => setError("Gagal memuat riwayat konsultasi. Silakan muat ulang halaman."))
      .finally(() => setLoading(false));
  }, [user]);

  const columns: Column<Consultation>[] = [
    {
      key: "created_at",
      header: "Tanggal dan Waktu",
      render: (row) => formatDateTimeWib(row.created_at),
    },
    {
      key: "top",
      header: "Rekomendasi Teratas",
      render: (row) => row.results[0]?.recommendation ?? "-",
    },
    {
      key: "cf",
      header: "CF Tertinggi",
      render: (row) => (
        <span className="font-semibold text-sw-ai">
          {row.results.length ? Math.max(...row.results.map((r) => r.percentage)) : 0}%
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: () => (
        <Badge className="border-transparent bg-sw-success/15 text-sw-success hover:bg-sw-success/15">
          Selesai
        </Badge>
      ),
    },
    {
      key: "action",
      header: "Aksi",
      className: "text-right",
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/app/riwayat/${row.id}`)}
        >
          <Eye className="size-4" /> Lihat Detail
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Riwayat Konsultasi"
        description="Daftar konsultasi yang pernah kamu lakukan."
        actions={
          <Button onClick={() => navigate("/app/konsultasi")}>
            <BookOpen className="size-4" /> Konsultasi Baru
          </Button>
        }
      />

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {loading ? (
        <LoadingState />
      ) : data.length === 0 && !error ? (
        <EmptyState
          title="Belum ada riwayat"
          description="Mulai konsultasi pertamamu untuk melihat riwayat di sini."
          action={
            <Button onClick={() => navigate("/app/konsultasi")}>
              Mulai Konsultasi
            </Button>
          }
        />
      ) : !error ? (
        <DataTable
          columns={columns}
          data={data}
          rowKey={(row) => row.id}
        />
      ) : null}
    </div>
  );
}
