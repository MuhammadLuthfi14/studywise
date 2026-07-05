// Service autentikasi (mock). Signature menyerupai endpoint FastAPI:
//   POST /auth/login, POST /auth/register
// Ganti isi fungsi dengan apiRequest(...) saat backend tersedia.

import { mockUsers } from "../data/mockData";
import type { AuthResponse, LoginCredentials, RegisterData, User } from "../types";
import { delay } from "./apiClient";

// Daftar pengguna in-memory agar registrasi demo bisa langsung dipakai.
let users: User[] = [...mockUsers];

function makeToken(user: User): string {
  return `mock-token.${user.id}.${Date.now()}`;
}

// POST /auth/login
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const user = users.find(
    (u) => u.email.toLowerCase() === credentials.email.trim().toLowerCase(),
  );

  // Mode mock: password apa pun diterima selama email terdaftar.
  if (!user) {
    throw new Error("Email tidak terdaftar. Periksa kembali email Anda.");
  }
  if (user.status === "nonaktif") {
    throw new Error("Akun Anda nonaktif. Hubungi admin.");
  }

  return delay({ token: makeToken(user), user });
}

// POST /auth/register — hanya untuk mahasiswa.
export async function register(data: RegisterData): Promise<AuthResponse> {
  const exists = users.some(
    (u) => u.email.toLowerCase() === data.email.trim().toLowerCase(),
  );
  if (exists) {
    throw new Error("Email sudah digunakan. Gunakan email lain.");
  }

  const newUser: User = {
    id: `u-${Date.now()}`,
    nama: data.nama,
    email: data.email,
    role: "mahasiswa", // role selalu mahasiswa untuk registrasi publik
    nim: data.nim,
    program_studi: data.program_studi,
    semester: data.semester,
    jenis_kelamin: data.jenis_kelamin,
    status: "aktif",
  };
  users = [...users, newUser];

  return delay({ token: makeToken(newUser), user: newUser });
}

export function logout(): void {
  try {
    sessionStorage.removeItem("studywise_token");
    sessionStorage.removeItem("studywise_user");
  } catch {
    /* abaikan */
  }
}
