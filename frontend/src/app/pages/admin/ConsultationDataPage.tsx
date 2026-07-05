import { useEffect, useMemo, useState } from "react";
import { Eye, Search } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { DataTable } from "../../components/DataTable";
import type { Column } from "../../components/DataTable";
import { LoadingState } from "../../components/LoadingState";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent } from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Badge } from "../../components/ui/badge";
import { ResultChart } from "../../components/ResultChart";
import { getAllConsultations } from "../../services/consultationService";
import { Alert, AlertDescription } from "../../components/ui/alert";
import type { Consultation } from "../../types";

export function ConsultationDataPage() {
  const [data, setData] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [detail, setDetail] = useState<Consultation | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllConsultations()
      .then(setData)
      .catch(() => setError("Gagal memuat data konsultasi. Silakan muat ulang halaman."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return data.filter((c) => {
      const matchQuery = c.user_nama.toLowerCase().includes(query.trim().toLowerCase());
      const matchDate = !date || c.created_at.startsWith(date);
      return matchQuery && matchDate;
    });
  }, [data, query, date]);

  const columns: Column<Consultation>[] = [
    { key: "user", header: "Mahasiswa", render: (r) => r.user_nama },
    {
      key: "date",
      header: "Tanggal",
      render: (r) =>
        new Date(r.created_at).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
    },
    { key: "rec", header: "Rekomendasi Utama", render: (r) => r.results[0]?.recommendation ?? "-" },
    {
      key: "cf",
      header: "CF Tertinggi",
      render: (r) => (
        <span className="font-semibold text-sw-ai">
          {Math.max(...r.results.map((x) => x.percentage))}%
        </span>
      ),
    },
    {
      key: "action",
      header: "Aksi",
      className: "text-right",
      render: (r) => (
        <Button variant="ghost" size="sm" onClick={() => setDetail(r)}>
          <Eye className="size-4" /> Detail
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Konsultasi"
        description="Seluruh konsultasi yang dilakukan mahasiswa."
      />

      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-1">
            <Label htmlFor="cari">Cari Mahasiswa</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="cari"
                className="pl-9"
                placeholder="Nama mahasiswa..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="tgl">Filter Tanggal</Label>
            <Input
              id="tgl"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          {(query || date) && (
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setDate("");
              }}
            >
              Reset
            </Button>
          )}
        </CardContent>
      </Card>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {loading ? (
        <LoadingState />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          rowKey={(r) => r.id}
          emptyTitle="Tidak ada konsultasi"
          emptyDescription="Tidak ada data yang cocok dengan filter."
        />
      )}

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Konsultasi</DialogTitle>
            <DialogDescription>
              {detail?.user_nama} ·{" "}
              {detail
                ? new Date(detail.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : ""}
            </DialogDescription>
          </DialogHeader>
          {detail ? (
            <div className="space-y-4">
              <ResultChart results={detail.results} />
              <div className="space-y-2">
                {detail.results.map((r, i) => (
                  <div
                    key={r.recommendation_code}
                    className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2 text-sm"
                  >
                    <span>
                      {i + 1}. {r.recommendation}
                    </span>
                    <Badge variant="outline">{r.percentage}%</Badge>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
