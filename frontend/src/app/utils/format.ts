// Util format bersama untuk StudyWise.

// Ambil inisial dari nama (maks. 2 huruf) untuk fallback avatar.
export function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}
