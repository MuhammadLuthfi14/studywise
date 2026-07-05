// Abstraksi HTTP client untuk StudyWise.
//
// Saat ini lapisan service masih memakai mock data. Ketika backend FastAPI siap,
// cukup arahkan service untuk memanggil `apiRequest` di bawah ini, dan set
// VITE_API_URL pada environment.

export const BASE_URL: string =
  (import.meta as any).env?.VITE_API_URL ?? "http://localhost:8000";

// Simulasi latency jaringan agar UI loading state terasa realistis.
export function delay<T>(data: T, ms = 500): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

function getToken(): string | null {
  try {
    return sessionStorage.getItem("studywise_token");
  } catch {
    return null;
  }
}

// Bersihkan sesi dan arahkan ke login — dipakai saat backend mengembalikan 401.
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

// Helper request nyata — belum dipakai selama mode mock, namun sudah siap.
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

  if (!res.ok) {
    const message = await res.text().catch(() => res.statusText);
    throw new Error(message || `Request gagal (${res.status})`);
  }

  return res.json() as Promise<T>;
}
