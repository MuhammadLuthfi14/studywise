// Abstraksi HTTP client untuk StudyWise.
//
// Frontend membaca URL backend dari VITE_API_URL. Jika env belum diisi,
// fallback lokal memakai FastAPI pada port 8000.

const DEFAULT_BASE_URL = "http://localhost:8000";

function normalizeBaseUrl(value: string | undefined): string {
  return (value?.trim() || DEFAULT_BASE_URL).replace(/\/+$/, "");
}

export const BASE_URL: string = normalizeBaseUrl(import.meta.env.VITE_API_URL);

function getToken(): string | null {
  try {
    return sessionStorage.getItem("studywise_token");
  } catch {
    return null;
  }
}

function handleUnauthorized(): never {
  try {
    sessionStorage.removeItem("studywise_token");
    sessionStorage.removeItem("studywise_user");
  } catch {
    /* abaikan */
  }
  window.location.href = "/login";
  throw new Error("Sesi berakhir. Silakan masuk kembali.");
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (res.status === 401) {
    handleUnauthorized();
  }

  const rawBody = await res.text();

  if (!res.ok) {
    let message = rawBody || res.statusText;
    try {
      const body = JSON.parse(rawBody) as { detail?: unknown };
      if (typeof body.detail === "string") message = body.detail;
    } catch {
      /* gunakan rawBody */
    }
    throw new Error(message || `Request gagal (${res.status})`);
  }

  if (!rawBody) {
    return undefined as T;
  }

  return JSON.parse(rawBody) as T;
}
