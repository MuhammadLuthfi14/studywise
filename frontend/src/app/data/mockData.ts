// Mock data StudyWise. Sementara menggantikan backend FastAPI + SQLite.
// Semua data ini nantinya akan datang dari endpoint API yang sesuai.

import type {
  Consultation,
  Recommendation,
  RecommendationResult,
  Rule,
  ScaleOption,
  Symptom,
  User,
} from "../types";

// ===== Skala konsultasi (label -> nilai CF user) =====
export const consultationScale: ScaleOption[] = [
  { label: "Tidak Sesuai", value: 0.0 },
  { label: "Kurang Sesuai", value: 0.25 },
  { label: "Cukup Sesuai", value: 0.5 },
  { label: "Sesuai", value: 0.75 },
  { label: "Sangat Sesuai", value: 1.0 },
];

// ===== Gejala / kondisi belajar =====
export const symptoms: Symptom[] = [
  { code: "G01", name: "Deadline tugas sudah dekat", status: "aktif" },
  { code: "G02", name: "Banyak tugas belum selesai", status: "aktif" },
  { code: "G03", name: "Sulit memahami materi dasar", status: "aktif" },
  { code: "G04", name: "Sering lupa konsep setelah belajar", status: "aktif" },
  { code: "G05", name: "Sering bingung saat mengerjakan soal atau praktik", status: "aktif" },
  { code: "G06", name: "Sulit fokus ketika belajar", status: "aktif" },
  { code: "G07", name: "Sering terdistraksi gadget", status: "aktif" },
  { code: "G08", name: "Waktu belajar tidak teratur", status: "aktif" },
  { code: "G09", name: "Sering menunda tugas", status: "aktif" },
  { code: "G10", name: "Kurang latihan soal atau praktik", status: "aktif" },
  { code: "G11", name: "Tidak tahu bagian mana yang harus dipelajari dulu", status: "aktif" },
  { code: "G12", name: "Nilai tugas atau kuis menurun", status: "aktif" },
  { code: "G13", name: "Materi terasa terlalu sulit", status: "aktif" },
  { code: "G14", name: "Kurang berdiskusi dengan teman", status: "aktif" },
  { code: "G15", name: "Jarang bertanya kepada dosen atau asisten", status: "aktif" },
  { code: "G16", name: "Lingkungan belajar kurang kondusif", status: "aktif" },
  { code: "G17", name: "Waktu belajar sedikit", status: "aktif" },
  { code: "G18", name: "Progres tugas masih rendah", status: "aktif" },
  { code: "G19", name: "Tugas memiliki bobot nilai besar", status: "aktif" },
  { code: "G20", name: "Mendekati ujian atau presentasi", status: "aktif" },
];

// ===== Rekomendasi strategi belajar =====
export const recommendations: Recommendation[] = [
  { code: "O01", name: "Prioritaskan tugas dengan deadline terdekat", description: "Susun tugas berdasarkan tenggat waktu paling dekat.", status: "aktif" },
  { code: "O02", name: "Fokus pada tugas dengan bobot nilai besar", description: "Dahulukan tugas yang paling memengaruhi nilai akhir.", status: "aktif" },
  { code: "O03", name: "Pecah tugas besar menjadi beberapa subtask kecil", description: "Bagi pekerjaan besar agar lebih mudah dikerjakan.", status: "aktif" },
  { code: "O04", name: "Buat jadwal belajar harian", description: "Tetapkan waktu belajar rutin setiap hari.", status: "aktif" },
  { code: "O05", name: "Gunakan metode Pomodoro atau belajar bertahap", description: "Belajar dalam interval fokus dengan jeda istirahat.", status: "aktif" },
  { code: "O06", name: "Pelajari ulang konsep dasar", description: "Kuatkan pemahaman fondasi sebelum materi lanjutan.", status: "aktif" },
  { code: "O07", name: "Perbanyak latihan soal atau praktik", description: "Tingkatkan penguasaan melalui latihan rutin.", status: "aktif" },
  { code: "O08", name: "Kurangi distraksi gadget saat belajar", description: "Matikan notifikasi dan jauhkan gangguan.", status: "aktif" },
  { code: "O09", name: "Cari tempat belajar yang lebih kondusif", description: "Pilih lingkungan tenang dan nyaman untuk belajar.", status: "aktif" },
  { code: "O10", name: "Diskusi dengan teman atau kelompok belajar", description: "Belajar bersama untuk saling melengkapi pemahaman.", status: "aktif" },
  { code: "O11", name: "Konsultasi dengan dosen atau asisten", description: "Tanyakan materi sulit langsung ke pengajar.", status: "aktif" },
  { code: "O12", name: "Review materi menjelang ujian atau presentasi", description: "Ulang materi penting sebelum penilaian.", status: "aktif" },
  { code: "O13", name: "Cari referensi tambahan seperti modul, video, atau dokumentasi", description: "Perkaya sumber belajar dari berbagai media.", status: "aktif" },
  { code: "O14", name: "Buat daftar prioritas belajar berdasarkan urgensi", description: "Urutkan materi/tugas sesuai tingkat kepentingan.", status: "aktif" },
  { code: "O15", name: "Evaluasi ulang pola belajar yang sedang digunakan", description: "Tinjau dan perbaiki kebiasaan belajar saat ini.", status: "aktif" },
];

// ===== Rule basis pengetahuan (relasi gejala -> rekomendasi + CF pakar) =====
export const rules: Rule[] = [
  { code: "R01", symptom_codes: ["G01", "G18"], recommendation_code: "O01", cf_pakar: 0.9, status: "aktif" },
  { code: "R02", symptom_codes: ["G19", "G02"], recommendation_code: "O02", cf_pakar: 0.85, status: "aktif" },
  { code: "R03", symptom_codes: ["G09", "G18"], recommendation_code: "O03", cf_pakar: 0.8, status: "aktif" },
  { code: "R04", symptom_codes: ["G02", "G08", "G09"], recommendation_code: "O04", cf_pakar: 0.9, status: "aktif" },
  { code: "R05", symptom_codes: ["G06", "G17"], recommendation_code: "O05", cf_pakar: 0.75, status: "aktif" },
  { code: "R06", symptom_codes: ["G03", "G13"], recommendation_code: "O06", cf_pakar: 0.85, status: "aktif" },
  { code: "R07", symptom_codes: ["G05", "G10"], recommendation_code: "O07", cf_pakar: 0.8, status: "aktif" },
  { code: "R08", symptom_codes: ["G06", "G07"], recommendation_code: "O08", cf_pakar: 0.85, status: "aktif" },
  { code: "R09", symptom_codes: ["G16"], recommendation_code: "O09", cf_pakar: 0.7, status: "aktif" },
  { code: "R10", symptom_codes: ["G14"], recommendation_code: "O10", cf_pakar: 0.7, status: "aktif" },
  { code: "R11", symptom_codes: ["G15", "G13"], recommendation_code: "O11", cf_pakar: 0.75, status: "aktif" },
  { code: "R12", symptom_codes: ["G20", "G12"], recommendation_code: "O12", cf_pakar: 0.85, status: "aktif" },
  { code: "R13", symptom_codes: ["G03", "G04"], recommendation_code: "O13", cf_pakar: 0.7, status: "aktif" },
  { code: "R14", symptom_codes: ["G11"], recommendation_code: "O14", cf_pakar: 0.8, status: "aktif" },
  { code: "R15", symptom_codes: ["G12", "G04"], recommendation_code: "O15", cf_pakar: 0.7, status: "aktif" },
];

// ===== Contoh hasil rekomendasi (digunakan untuk simulasi proses konsultasi) =====
export const mockResults: RecommendationResult[] = [
  {
    recommendation_code: "O04",
    recommendation: "Buat jadwal belajar harian",
    cf_value: 0.82,
    percentage: 82,
    reason: "Banyak tugas belum selesai, waktu belajar tidak teratur, dan sering menunda tugas.",
  },
  {
    recommendation_code: "O01",
    recommendation: "Prioritaskan tugas dengan deadline terdekat",
    cf_value: 0.76,
    percentage: 76,
    reason: "Deadline tugas dekat dan progres tugas masih rendah.",
  },
  {
    recommendation_code: "O03",
    recommendation: "Pecah tugas besar menjadi beberapa subtask kecil",
    cf_value: 0.71,
    percentage: 71,
    reason: "Sering menunda tugas dan progres tugas masih rendah.",
  },
  {
    recommendation_code: "O08",
    recommendation: "Kurangi distraksi gadget saat belajar",
    cf_value: 0.68,
    percentage: 68,
    reason: "Sulit fokus dan sering terdistraksi gadget.",
  },
];

// Re-export dari utils/constants agar tidak ada breaking import yang tersisa.
// Impor baru sebaiknya menggunakan: import { ... } from "../utils/constants"
export { programStudiOptions, getSemesterOptions } from "../utils/constants";

// ===== Pengguna (untuk demo login & Data Pengguna) =====
export const mockUsers: User[] = [
  {
    id: "u-1",
    nama: "Andi Pratama",
    email: "mahasiswa@studywise.ac.id",
    role: "mahasiswa",
    nim: "2231140012",
    program_studi: "D4 - Teknologi Rekayasa Perangkat Lunak",
    semester: 4,
    jenis_kelamin: "laki-laki",
    status: "aktif",
  },
  {
    id: "u-2",
    nama: "Siti Nurhaliza",
    email: "siti@studywise.ac.id",
    role: "mahasiswa",
    nim: "2231140045",
    program_studi: "D3 - Manajemen Informatika",
    semester: 2,
    jenis_kelamin: "perempuan",
    status: "aktif",
  },
  {
    id: "u-3",
    nama: "Budi Santoso",
    email: "budi@studywise.ac.id",
    role: "mahasiswa",
    nim: "2231140078",
    program_studi: "D4 - Teknologi Rekayasa Internet",
    semester: 6,
    jenis_kelamin: "laki-laki",
    status: "nonaktif",
  },
  {
    id: "u-4",
    nama: "Dewi Lestari",
    email: "dewi@studywise.ac.id",
    role: "mahasiswa",
    nim: "2231140090",
    program_studi: "D3 - Teknik Komputer",
    semester: 3,
    jenis_kelamin: "perempuan",
    status: "aktif",
  },
  {
    id: "admin-1",
    nama: "Admin StudyWise",
    email: "admin@studywise.ac.id",
    role: "admin",
    status: "aktif",
  },
];

// ===== Riwayat konsultasi =====
export const mockConsultations: Consultation[] = [
  {
    id: "c-1001",
    user_id: "u-1",
    user_nama: "Andi Pratama",
    created_at: "2026-06-10T09:24:00.000Z",
    answers: [
      { symptom_code: "G02", cf_user: 1.0 },
      { symptom_code: "G08", cf_user: 0.75 },
      { symptom_code: "G09", cf_user: 0.75 },
      { symptom_code: "G01", cf_user: 0.5 },
      { symptom_code: "G18", cf_user: 0.75 },
    ],
    active_rules: ["R04", "R01", "R03"],
    results: mockResults,
  },
  {
    id: "c-1002",
    user_id: "u-1",
    user_nama: "Andi Pratama",
    created_at: "2026-05-28T14:10:00.000Z",
    answers: [
      { symptom_code: "G03", cf_user: 0.75 },
      { symptom_code: "G13", cf_user: 1.0 },
      { symptom_code: "G05", cf_user: 0.5 },
    ],
    active_rules: ["R06", "R07"],
    results: [
      {
        recommendation_code: "O06",
        recommendation: "Pelajari ulang konsep dasar",
        cf_value: 0.88,
        percentage: 88,
        reason: "Sulit memahami materi dasar dan materi terasa terlalu sulit.",
      },
      {
        recommendation_code: "O07",
        recommendation: "Perbanyak latihan soal atau praktik",
        cf_value: 0.74,
        percentage: 74,
        reason: "Sering bingung saat mengerjakan soal dan kurang latihan.",
      },
    ],
  },
  {
    id: "c-1003",
    user_id: "u-2",
    user_nama: "Siti Nurhaliza",
    created_at: "2026-06-12T08:00:00.000Z",
    answers: [
      { symptom_code: "G20", cf_user: 1.0 },
      { symptom_code: "G12", cf_user: 0.75 },
      { symptom_code: "G06", cf_user: 0.5 },
    ],
    active_rules: ["R12", "R05"],
    results: [
      {
        recommendation_code: "O12",
        recommendation: "Review materi menjelang ujian atau presentasi",
        cf_value: 0.9,
        percentage: 90,
        reason: "Mendekati ujian dan nilai kuis menurun.",
      },
      {
        recommendation_code: "O05",
        recommendation: "Gunakan metode Pomodoro atau belajar bertahap",
        cf_value: 0.65,
        percentage: 65,
        reason: "Sulit fokus ketika belajar.",
      },
    ],
  },
];
