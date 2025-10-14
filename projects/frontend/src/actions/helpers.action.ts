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
  set("location", fieldErrors.place);
  set("details", fieldErrors.detail);
  set("capacity", fieldErrors.capacity);
  set("status", fieldErrors.status);
  set("eventTime", fieldErrors.time);
  set("cost", fieldErrors.cost);
  set("rating", fieldErrors.rating);
  set("photo", fieldErrors.photo);
  set("userId", fieldErrors.userId);
  return m;
}

/* ---------- Helpers: form mapping ---------- */
export function formToDbShape(fd: FormData) {
  const rawStatus = String(fd.get("status") ?? "");
  const status =
    rawStatus === "publish"
      ? "active"
      : rawStatus === "unpublish"
      ? "inactive"
      : rawStatus || "active";

  return {
    name: String(fd.get("eventName") ?? ""),
    date: String(fd.get("eventDate") ?? ""),
    time: String(fd.get("eventTime") ?? "") || "00:00",
    place: String(fd.get("location") ?? ""),
    capacity: fd.get("capacity"),
    detail: String(fd.get("details") ?? ""),
    cost: fd.get("cost"),
    rating: fd.get("rating"),
    status,
    userId: 15, // ชั่วคราว ถ้าหลังบ้านยัง require
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
  };
}
/* ---------- Helpers: DTO Update ---------- */
export function toUpdateDtoFromForm(fd: FormData): UpdateEventDto {
  const num = (v: any) => (v === "" || v == null ? undefined : Number(v));
  const s = (k: string) => {
    const v = fd.get(k);
    return typeof v === "string" && v ? v : undefined;
  };

  return {
    name: s("eventName"),
    date: s("eventDate"),
    place: s("location"),
    detail: s("details"),
    capacity: num(fd.get("capacity")),
  };
}

/* ---------- Helpers: SSR fetch ---------- */
export function buildEventUrl(id: number) {
  const base = (OpenAPI as any).BASE ?? (OpenAPI as any).BASE_URL ?? "";
  return `${base}/events/${id}`;
}
