// Service basis pengetahuan dan pengguna.

import type { Recommendation, Rule, Symptom, User } from "../types";
import { apiRequest } from "./apiClient";

// ===== Gejala =====
export async function listSymptoms(): Promise<Symptom[]> {
  return apiRequest<Symptom[]>("/symptoms?include_inactive=true");
}
export async function saveSymptom(item: Symptom): Promise<Symptom> {
  return apiRequest<Symptom>(`/symptoms/${encodeURIComponent(item.code)}`, {
    method: "PUT",
    body: JSON.stringify(item),
  });
}
export async function deleteSymptom(code: string): Promise<void> {
  await apiRequest<void>(`/symptoms/${encodeURIComponent(code)}`, { method: "DELETE" });
}

// ===== Rekomendasi =====
export async function listRecommendations(): Promise<Recommendation[]> {
  return apiRequest<Recommendation[]>("/recommendations?include_inactive=true");
}
export async function saveRecommendation(item: Recommendation): Promise<Recommendation> {
  return apiRequest<Recommendation>(
    `/recommendations/${encodeURIComponent(item.code)}`,
    {
      method: "PUT",
      body: JSON.stringify(item),
    },
  );
}
export async function deleteRecommendation(code: string): Promise<void> {
  await apiRequest<void>(`/recommendations/${encodeURIComponent(code)}`, {
    method: "DELETE",
  });
}

// ===== Rule & CF Pakar =====
export async function listRules(): Promise<Rule[]> {
  return apiRequest<Rule[]>("/rules?include_inactive=true");
}
export async function saveRule(item: Rule): Promise<Rule> {
  return apiRequest<Rule>(`/rules/${encodeURIComponent(item.code)}`, {
    method: "PUT",
    body: JSON.stringify(item),
  });
}
export async function deleteRule(code: string): Promise<void> {
  await apiRequest<void>(`/rules/${encodeURIComponent(code)}`, { method: "DELETE" });
}

// ===== Pengguna =====
export async function listUsers(): Promise<User[]> {
  return apiRequest<User[]>("/users");
}
export async function saveUser(item: User): Promise<User> {
  return apiRequest<User>(`/users/${encodeURIComponent(item.id)}`, {
    method: "PUT",
    body: JSON.stringify(item),
  });
}
export async function deleteUser(id: string): Promise<void> {
  await apiRequest<void>(`/users/${encodeURIComponent(id)}`, { method: "DELETE" });
}
