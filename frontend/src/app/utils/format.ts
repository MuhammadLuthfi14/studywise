// Util format bersama untuk StudyWise.

const WIB_TIME_ZONE = "Asia/Jakarta";
const ISO_TIME_ZONE_SUFFIX = /(?:Z|[+-]\d{2}:\d{2})$/i;

export type DateTimeWibStyle = "standard" | "detail" | "compact";

function parseApiDate(iso: string): Date | null {
  const normalized = ISO_TIME_ZONE_SUFFIX.test(iso) ? iso : `${iso}Z`;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

function datePart(
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes,
): string {
  return parts.find((part) => part.type === type)?.value ?? "";
}

export function formatDateTimeWib(
  iso: string,
  style: DateTimeWibStyle = "standard",
): string {
  const date = parseApiDate(iso);
  if (!date) return "-";

  const parts = new Intl.DateTimeFormat("id-ID", {
    timeZone: WIB_TIME_ZONE,
    weekday: style === "detail" ? "long" : undefined,
    day: "numeric",
    month: style === "compact" ? "short" : "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const weekday = datePart(parts, "weekday");
  const day = datePart(parts, "day");
  const month = datePart(parts, "month");
  const year = datePart(parts, "year");
  const hour = datePart(parts, "hour");
  const minute = datePart(parts, "minute");
  const dateLabel = style === "detail"
    ? `${weekday}, ${day} ${month} ${year}`
    : `${day} ${month} ${year}`;

  return `${dateLabel}, ${hour}.${minute} WIB`;
}

export function wibDateKey(iso: string): string {
  const date = parseApiDate(iso);
  if (!date) return "";

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: WIB_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(date);

  return [
    datePart(parts, "year"),
    datePart(parts, "month"),
    datePart(parts, "day"),
  ].join("-");
}

// Ambil inisial dari nama (maks. 2 huruf) untuk fallback avatar.
export function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}
