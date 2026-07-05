// Tipe data StudyWise — selaras dengan kontrak backend FastAPI yang akan dibangun.

export type Role = "mahasiswa" | "admin";

export type Status = "aktif" | "nonaktif";

export interface User {
  id: string;
  nama: string;
  email: string;
  role: Role;
  nim?: string;
  program_studi?: string; // label gabungan, mis. "D4 - Teknologi Rekayasa Perangkat Lunak"
  semester?: number;
  jenis_kelamin?: "laki-laki" | "perempuan";
  status: Status;
}

export interface Symptom {
  code: string; // mis. G01
  name: string;
  status: Status;
}

export interface Recommendation {
  code: string; // mis. O01
  name: string;
  description?: string;
  status: Status;
}

export interface Rule {
  code: string; // mis. R01
  symptom_codes: string[]; // gejala terkait
  recommendation_code: string; // rekomendasi yang dihasilkan
  cf_pakar: number; // 0.00 - 1.00
  status: Status;
}

// ===== Konsultasi =====

export interface ConsultationAnswer {
  symptom_code: string;
  cf_user: number; // 0.00 - 1.00
}

export interface ConsultationRequest {
  answers: ConsultationAnswer[];
}

export interface RecommendationResult {
  recommendation_code: string;
  recommendation: string;
  cf_value: number; // 0.00 - 1.00
  percentage: number; // 0 - 100
  reason: string;
}

export interface Consultation {
  id: string;
  user_id: string;
  user_nama: string;
  created_at: string; // ISO date
  answers: ConsultationAnswer[];
  active_rules: string[]; // kode rule yang aktif
  results: RecommendationResult[];
}

// ===== Auth =====

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nama: string;
  nim: string;
  email: string;
  password: string;
  program_studi: string;
  semester: number;
  jenis_kelamin: "laki-laki" | "perempuan";
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ===== Skala konsultasi =====

export interface ScaleOption {
  label: string;
  value: number;
}
