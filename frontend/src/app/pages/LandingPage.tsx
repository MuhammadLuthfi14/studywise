import { useNavigate } from "react-router";
import {
  Brain,
  CheckCircle2,
  GaugeCircle,
  GitBranch,
  History,
  LineChart,
  ListChecks,
  Sparkles,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { BrandMark } from "../components/Logo";

const features = [
  {
    icon: ListChecks,
    title: "Konsultasi Terpandu",
    desc: "Jawab kondisi belajarmu lewat skala kesesuaian yang mudah dipahami.",
    accent: "text-sw-primary bg-sw-primary/10",
  },
  {
    icon: Brain,
    title: "Sistem Pakar",
    desc: "Rekomendasi disusun dari basis pengetahuan dan aturan pakar.",
    accent: "text-sw-ai bg-sw-ai/10",
  },
  {
    icon: GaugeCircle,
    title: "Nilai Keyakinan",
    desc: "Setiap rekomendasi disertai tingkat keyakinan (Certainty Factor).",
    accent: "text-sw-success bg-sw-success/10",
  },
  {
    icon: History,
    title: "Riwayat Konsultasi",
    desc: "Pantau perkembangan strategi belajarmu dari waktu ke waktu.",
    accent: "text-sw-primary bg-sw-primary/10",
  },
];

const steps = [
  {
    icon: ListChecks,
    title: "Isi Konsultasi",
    desc: "Pilih tingkat kesesuaian untuk tiap kondisi belajar.",
  },
  {
    icon: GitBranch,
    title: "Forward Chaining",
    desc: "Sistem menelusuri aturan pakar dari fakta yang kamu berikan.",
  },
  {
    icon: LineChart,
    title: "Hasil Rekomendasi",
    desc: "Dapatkan strategi belajar terurut beserta nilai keyakinannya.",
  },
];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Header */}
      <header className="mx-auto flex max-w-6xl 3xl:max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <BrandMark />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
            Masuk
          </Button>
          <Button size="sm" onClick={() => navigate("/register")}>
            <span className="hidden sm:inline">Daftar Mahasiswa</span>
            <span className="sm:hidden">Daftar</span>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl 3xl:max-w-7xl items-center gap-6 px-4 py-8 xs:gap-8 xs:py-10 sm:px-6 md:grid-cols-2 md:gap-12 md:py-16 lg:px-8 lg:py-20 3xl:py-28">
        <div>
          <Badge className="gap-1 border-transparent bg-sw-ai/10 text-sw-ai hover:bg-sw-ai/10">
            <Sparkles className="size-3" />
            Sistem Pakar Strategi Belajar
          </Badge>
          <h1 className="mt-3 text-2xl leading-tight font-semibold xs:mt-4 xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
            Temukan strategi belajar terbaik bersama{" "}
            <span className="text-sw-primary">StudyWise</span>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground xs:mt-4 xs:text-base sm:text-lg">
            StudyWise membantu mahasiswa menemukan strategi belajar yang paling
            sesuai dengan kondisinya. Sistem pakar ini memakai metode{" "}
            <span className="font-medium text-foreground">Forward Chaining</span> dan{" "}
            <span className="font-medium text-foreground">Certainty Factor</span> untuk
            memberi rekomendasi yang terurut beserta tingkat keyakinannya.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 xs:mt-6">
            <Button size="lg" onClick={() => navigate("/register")}>
              Daftar Mahasiswa
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
              Masuk
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground xs:mt-6 xs:gap-x-6">
            {["Gratis untuk mahasiswa", "Mudah digunakan", "Hasil dapat disimpan"].map(
              (t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-sw-success" />
                  {t}
                </span>
              ),
            )}
          </div>
        </div>

        {/* Visual — disembunyikan di 320px, tampil mulai xs (360px) */}
        <div className="relative hidden xs:block">
          <div className="absolute -inset-4 rounded-3xl bg-sw-primary/10 blur-2xl" />
          <Card className="relative">
            <CardContent className="space-y-4 p-4 sm:p-5 md:p-6">
              <div className="flex items-center gap-2 text-sm font-medium text-sw-ai">
                <Brain className="size-4" /> Contoh Hasil Rekomendasi
              </div>
              {[
                { label: "Buat jadwal belajar harian", value: 82, tone: "bg-sw-ai" },
                { label: "Prioritaskan tugas deadline terdekat", value: 76, tone: "bg-sw-primary" },
                { label: "Pecah tugas besar jadi subtask", value: 71, tone: "bg-sw-success" },
              ].map((r) => (
                <div key={r.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate pr-2">{r.label}</span>
                    <span className="shrink-0 font-semibold">{r.value}%</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${r.tone}`}
                      style={{ width: `${r.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Fitur */}
      <section className="mx-auto max-w-6xl 3xl:max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 3xl:py-16">
        <div className="text-center">
          <h2>Kenapa StudyWise?</h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Dirancang sederhana, transparan, dan ramah mahasiswa.
          </p>
        </div>
        <div className="mt-6 grid gap-3 xs:grid-cols-2 xs:gap-4 md:grid-cols-4 sm:mt-8">
          {features.map((f) => (
            <Card key={f.title}>
              <CardContent className="space-y-3 p-4 sm:p-5">
                <div
                  className={`flex size-10 items-center justify-center rounded-xl sm:size-11 ${f.accent}`}
                >
                  <f.icon className="size-5" />
                </div>
                <div className="font-medium">{f.title}</div>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Cara kerja */}
      <section className="mx-auto max-w-6xl 3xl:max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 3xl:py-16">
        <div className="text-center">
          <h2>Bagaimana Cara Kerjanya?</h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Tiga langkah sederhana menuju strategi belajar yang tepat.
          </p>
        </div>
        <div className="mt-6 grid gap-3 xs:gap-4 sm:mt-8 sm:grid-cols-3">
          {steps.map((s, i) => (
            <Card key={s.title}>
              <CardContent className="space-y-3 p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-sw-primary font-semibold text-white sm:size-9">
                    {i + 1}
                  </span>
                  <s.icon className="size-5 text-sw-ai" />
                </div>
                <div className="font-medium">{s.title}</div>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl 3xl:max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 3xl:py-16">
        <Card className="overflow-hidden border-none bg-sw-primary text-white">
          <CardContent className="flex flex-col items-center gap-4 p-5 text-center sm:p-8 md:p-10">
            <h2 className="text-white">Siap menemukan strategi belajarmu?</h2>
            <p className="max-w-xl text-sm text-white/90 sm:text-base">
              Mulai konsultasi pertamamu hari ini dan dapatkan rekomendasi yang
              dipersonalisasi untuk kebutuhan belajarmu.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-sw-primary hover:bg-white/90"
              onClick={() => navigate("/register")}
            >
              Daftar Sekarang
            </Button>
          </CardContent>
        </Card>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl 3xl:max-w-7xl px-4 py-6 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
          StudyWise — Sistem Pakar Rekomendasi Strategi Belajar · Proyek Kecerdasan
          Buatan
        </div>
      </footer>
    </div>
  );
}
