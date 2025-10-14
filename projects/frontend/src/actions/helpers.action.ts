import "server-only";

import { OpenAPI } from "@/lib/api/core/OpenAPI";
import type { CreateEventDto, UpdateEventDto } from "@/lib/api";

/* ---------- Helpers: file / photo ---------- */
export function extractPhoto(
  formData: FormData,
  base = "photo"
): File | string | null {
  const file = formData.get(`${base}File`);
  if (file instanceof File && file.size > 0) return file;

  const existing = formData.get(`${base}Existing`);
  if (typeof existing === "string" && existing.length > 0) return existing;

  const legacy = formData.get(base);
  if (legacy instanceof File) return legacy.size > 0 ? legacy : null;
  if (typeof legacy === "string") return legacy.length > 0 ? legacy : null;
  return null;
}

/* ---------- Helpers: error mapping ---------- */
export function compactZodErrors(
  errors: Record<string, string[] | undefined>,
  max = 10
): string {
  const parts: string[] = [];
  for (const [field, arr] of Object.entries(errors)) {
    if (arr && arr.length) parts.push(`${field}: ${arr[0]}`);
    if (parts.length >= max) break;
  }
  return parts.join(" | ") || "Validation failed";
}

/** map error keys (DB → Form UI) */
export function mapErrorsToFormKeys(
  fieldErrors: Record<string, string[] | undefined>
): Record<string, string[]> {
  const m: Record<string, string[]> = {};
  const set = (k: string, v?: string[]) => {
    if (v?.length) m[k] = v;
  };

  set("eventName", fieldErrors.name);
  set("eventDate", fieldErrors.date);
  set("eventLocation", fieldErrors.place);
  set("eventDetails", fieldErrors.detail);
  set("eventCapacity", fieldErrors.capacity);
  set("eventStatus", fieldErrors.status);
  set("eventTime", fieldErrors.time);
  set("eventCost", fieldErrors.cost);
  set("eventRating", fieldErrors.rating);
  set("eventPhoto", fieldErrors.photo);
  set("userId", fieldErrors.userId);
  return m;
}

/* ---------- Helpers: form mapping ---------- */
export function formToDbShape(fd: FormData) {
  const rawStatus = String(fd.get("eventStatus") ?? "");
  const status =
    rawStatus === "publish"
      ? "active"
      : rawStatus === "unpublish"
      ? "inactive"
      : rawStatus || "active"; // fallback

  return {
    name: String(fd.get("eventName") ?? ""),
    date: String(fd.get("eventDate") ?? ""),
    time: String(fd.get("eventTime") ?? "") || "00:00",
    place: String(fd.get("eventLocation") ?? ""),
    capacity: fd.get("eventCapacity"),
    detail: String(fd.get("eventDetails") ?? ""),
    cost: fd.get("eventCost"),
    rating: fd.get("eventRating"),
    status,
    photo: extractPhoto(fd, "photo"),
  };
}

/* ---------- Helpers: DTO builders ---------- */
export function toCreateDto(parsed: any, userId: number): CreateEventDto {
  const num = (v: any) => (v === "" || v == null ? undefined : Number(v));
  const time = parsed.time?.match(/^\d{2}:\d{2}$/)
    ? `${parsed.time}:00`
    : parsed.time;

  return {
    name: parsed.name,
    date: parsed.date,
    time,
    place: parsed.place || "",
    capacity: num(parsed.capacity),
    detail: parsed.detail,
    cost: num(parsed.cost),
    rating: num(parsed.rating),
    userId,
    status: parsed.status as string | any,
  };
}
/* ---------- Helpers: DTO Update ---------- */
export function toUpdateDtoFromForm(fd: FormData): UpdateEventDto {
  const num = (v: any) => (v === "" || v == null ? undefined : Number(v));
  const s = (k: string) => {
    const v = fd.get(k);
    return typeof v === "string" && v ? v : undefined;
  };

  const rawStatus = String(fd.get("eventStatus") ?? "");
  const status =
    rawStatus === "publish"
      ? "active"
      : rawStatus === "unpublish"
      ? "inactive"
      : undefined;

  return {
    name: s("eventName"),
    date: s("eventDate"),
    time: (() => {
      const t = s("eventTime");
      return t && /^\d{2}:\d{2}$/.test(t) ? `${t}:00` : t;
    })(),
    place: s("eventLocation"),
    detail: s("eventDetails"),
    capacity: num(fd.get("eventCapacity")),
    cost: num(fd.get("eventCost")),
    rating: num(fd.get("eventRating")),
    status,
  };
}

/* ---------- Helpers: SSR fetch ---------- */
export function buildEventUrl(id: number) {
  const base = (OpenAPI as any).BASE ?? (OpenAPI as any).BASE_URL ?? "";
  return `${base}/events/${id}`;
}
