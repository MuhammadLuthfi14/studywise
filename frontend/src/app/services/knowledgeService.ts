// Service basis pengetahuan & pengguna (mock). Signature menyerupai endpoint FastAPI:
//   GET/POST/PUT/DELETE /symptoms, /recommendations, /rules, /users
// Semua mutasi bersifat in-memory selama mode mock.

import {
  mockUsers,
  recommendations as seedRecommendations,
  rules as seedRules,
  symptoms as seedSymptoms,
} from "../data/mockData";
import type { Recommendation, Rule, Symptom, User } from "../types";
import { delay } from "./apiClient";

let symptoms: Symptom[] = [...seedSymptoms];
let recommendations: Recommendation[] = [...seedRecommendations];
let rules: Rule[] = [...seedRules];
let users: User[] = [...mockUsers];

// ===== Gejala =====
export async function listSymptoms(): Promise<Symptom[]> {
  return delay([...symptoms]);
}
export async function saveSymptom(item: Symptom): Promise<Symptom> {
  const idx = symptoms.findIndex((s) => s.code === item.code);
  if (idx >= 0) symptoms[idx] = item;
  else symptoms = [...symptoms, item];
  return delay(item, 300);
}
export async function deleteSymptom(code: string): Promise<void> {
  symptoms = symptoms.filter((s) => s.code !== code);
  return delay(undefined, 300);
}

// ===== Rekomendasi =====
export async function listRecommendations(): Promise<Recommendation[]> {
  return delay([...recommendations]);
}
export async function saveRecommendation(item: Recommendation): Promise<Recommendation> {
  const idx = recommendations.findIndex((r) => r.code === item.code);
  if (idx >= 0) recommendations[idx] = item;
  else recommendations = [...recommendations, item];
  return delay(item, 300);
}
export async function deleteRecommendation(code: string): Promise<void> {
  recommendations = recommendations.filter((r) => r.code !== code);
  return delay(undefined, 300);
}

// ===== Rule & CF Pakar =====
export async function listRules(): Promise<Rule[]> {
  return delay([...rules]);
}
export async function saveRule(item: Rule): Promise<Rule> {
  const idx = rules.findIndex((r) => r.code === item.code);
  if (idx >= 0) rules[idx] = item;
  else rules = [...rules, item];
  return delay(item, 300);
}
export async function deleteRule(code: string): Promise<void> {
  rules = rules.filter((r) => r.code !== code);
  return delay(undefined, 300);
}

// ===== Pengguna =====
export async function listUsers(): Promise<User[]> {
  return delay([...users]);
}
export async function saveUser(item: User): Promise<User> {
  const idx = users.findIndex((u) => u.id === item.id);
  if (idx >= 0) users[idx] = item;
  else users = [...users, item];
  return delay(item, 300);
}
export async function deleteUser(id: string): Promise<void> {
  users = users.filter((u) => u.id !== id);
  return delay(undefined, 300);
}
