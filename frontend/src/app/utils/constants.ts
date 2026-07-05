// Konstanta konfigurasi UI StudyWise.
// Data ini bersifat statis dan tidak bergantung pada backend.

export const programStudiOptions: string[] = [
  "D3 - Manajemen Informatika",
  "D3 - Teknik Komputer",
  "D3 - Akuntansi",
  "D3 - Teknik Elektronika",
  "D3 - Teknik Telekomunikasi",
  "D3 - Teknik Listrik",
  "D3 - Teknik Mesin",
  "D3 - Teknik Sipil",
  "D3 - Administrasi Bisnis",
  "D3 - Bahasa Inggris",
  "D4 - Teknologi Rekayasa Perangkat Lunak",
  "D4 - Teknologi Rekayasa Internet",
  "D4 - Bisnis Digital",
  "D4 - Akuntansi",
  "D4 - Teknik Elektronika Industri",
  "D4 - Teknologi Rekayasa Instalasi Listrik",
  "D4 - Manajemen Rekayasa Konstruksi",
  "D4 - Perancangan Jalan dan Jembatan",
  "D4 - Rekayasa Perancangan Mekanik",
  "D4 - Animasi",
];

// D3 = 6 semester, D4 = 8 semester.
export function getSemesterOptions(programStudi: string): number[] {
  if (!programStudi) return [];
  const max = programStudi.startsWith("D3") ? 6 : 8;
  return Array.from({ length: max }, (_, i) => i + 1);
}

// Skala kesesuaian CF yang digunakan di form konsultasi dan detail riwayat.
export const consultationScale = [
  { label: "Tidak Sesuai", value: 0.0 },
  { label: "Kurang Sesuai", value: 0.25 },
  { label: "Cukup Sesuai", value: 0.5 },
  { label: "Sesuai", value: 0.75 },
  { label: "Sangat Sesuai", value: 1.0 },
];
