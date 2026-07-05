// Service autentikasi. Signature menyerupai endpoint FastAPI:
//   POST /auth/login, POST /auth/register

import type { AuthResponse, LoginCredentials, RegisterData } from "../types";
import { apiRequest } from "./apiClient";

// POST /auth/login
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

// POST /auth/register - hanya untuk mahasiswa.
export async function register(data: RegisterData): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function logout(): void {
  try {
    sessionStorage.removeItem("studywise_token");
    sessionStorage.removeItem("studywise_user");
  } catch {
    /* abaikan */
  }
}
