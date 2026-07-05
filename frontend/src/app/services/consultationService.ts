// Service konsultasi (mock). Signature menyerupai endpoint FastAPI:
//   GET  /symptoms
//   POST /consultations/process  → { results, active_rules }
//   GET  /consultations/history
//   GET  /consultations/{id}
//
// CATATAN: Perhitungan Forward Chaining & Certainty Factor TIDAK dilakukan di sini.
// Frontend hanya mengirim jawaban dan menerima hasil dari backend. Selama mode mock,
// kita kembalikan hasil contoh yang sudah disiapkan.

import { mockConsultations, mockResults, symptoms } from "../data/mockData";
import type {
  Consultation,
  ConsultationRequest,
  RecommendationResult,
  Symptom,
} from "../types";
import { delay } from "./apiClient";

let history: Consultation[] = [...mockConsultations];

// Shape respons POST /consultations/process — selaras dengan kontrak FastAPI.
export interface ConsultationProcessResponse {
  results: RecommendationResult[];
  active_rules: string[];
}

// GET /symptoms
export async function getSymptoms(): Promise<Symptom[]> {
  return delay(symptoms.filter((s) => s.status === "aktif"));
}

// POST /consultations/process
// Backend asli menjalankan Forward Chaining + CF dan mengembalikan hasil + rule aktif.
export async function processConsultation(
  req: ConsultationRequest,
): Promise<ConsultationProcessResponse> {
  void req; // payload dikirim ke backend asli; mock mengabaikan isi jawaban
  const results = [...mockResults].sort((a, b) => b.cf_value - a.cf_value);
  // Mock active_rules — backend asli mengembalikan rule yang benar-benar terpicu
  const active_rules = ["R04", "R01", "R03", "R08"];
  return delay({ results, active_rules }, 900);
}

// GET /consultations/history
export async function getHistory(userId: string): Promise<Consultation[]> {
  const data = history
    .filter((c) => c.user_id === userId)
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
  return delay(data);
}

// GET /consultations (admin — seluruh konsultasi)
export async function getAllConsultations(): Promise<Consultation[]> {
  const data = [...history].sort(
    (a, b) => +new Date(b.created_at) - +new Date(a.created_at),
  );
  return delay(data);
}

// GET /consultations/{id}
export async function getConsultation(id: string): Promise<Consultation | undefined> {
  return delay(history.find((c) => c.id === id));
}

// POST /consultations (simpan hasil)
export async function saveConsultation(
  consultation: Omit<Consultation, "id" | "created_at">,
): Promise<Consultation> {
  const saved: Consultation = {
    ...consultation,
    id: `c-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  history = [saved, ...history];
  return delay(saved, 400);
}
