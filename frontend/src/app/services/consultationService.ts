// Service konsultasi. Perhitungan Forward Chaining dan Certainty Factor
// dilakukan di backend Python, bukan di frontend.

import type {
  Consultation,
  ConsultationRequest,
  RecommendationResult,
  Symptom,
} from "../types";
import { apiRequest } from "./apiClient";

export interface ConsultationProcessResponse {
  results: RecommendationResult[];
  active_rules: string[];
}

// GET /symptoms
export async function getSymptoms(): Promise<Symptom[]> {
  return apiRequest<Symptom[]>("/symptoms");
}

// POST /consultations/process
export async function processConsultation(
  req: ConsultationRequest,
): Promise<ConsultationProcessResponse> {
  return apiRequest<ConsultationProcessResponse>("/consultations/process", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

// GET /consultations/history
export async function getHistory(userId: string): Promise<Consultation[]> {
  return apiRequest<Consultation[]>(
    `/consultations/history?user_id=${encodeURIComponent(userId)}`,
  );
}

// GET /consultations (admin - seluruh konsultasi)
export async function getAllConsultations(): Promise<Consultation[]> {
  return apiRequest<Consultation[]>("/consultations");
}

// GET /consultations/{id}
export async function getConsultation(id: string): Promise<Consultation | undefined> {
  try {
    return await apiRequest<Consultation>(`/consultations/${encodeURIComponent(id)}`);
  } catch {
    return undefined;
  }
}

// POST /consultations (simpan hasil)
export async function saveConsultation(
  consultation: Omit<Consultation, "id" | "created_at">,
): Promise<Consultation> {
  return apiRequest<Consultation>("/consultations", {
    method: "POST",
    body: JSON.stringify(consultation),
  });
}
