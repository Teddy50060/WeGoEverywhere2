import "server-only";

import { OpenAPI } from "@/lib/api/core/OpenAPI";
import type { CreateEventDto, UpdateEventDto } from "@/lib/api";

/* ---------- Auth Helper (แนบ DEV_BEARER ให้ทุกคำสั่ง) ---------- */
export function ensureAuthHeader() {
  const token = process.env.DEV_BEARER?.trim();
  if (!token) {
    throw new Error(
      "DEV_BEARER is missing. โปรดตั้งค่า DEV_BEARER ในไฟล์ .env หรือ .env.local แล้ว RESTART dev server"
    );
  }
  OpenAPI.HEADERS = {
    ...(OpenAPI.HEADERS || {}),
    Authorization: `Bearer ${token}`,
  };
  return `Bearer ${token}`;
}

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
    userId: 18, // ชั่วคราว ถ้าหลังบ้านยัง require
    photo: extractPhoto(fd, "photo"),
  };
}

/* ---------- Helpers: DTO builders ---------- */
export function toCreateDto(data: any): CreateEventDto {
  const toNumberOrUndef = (v: any): number | undefined => {
    if (v === undefined || v === null || v === "") return undefined;
    const n = Number(v);
    return isNaN(n) ? undefined : n;
  };

  return {
    name: data.name,
    date: data.date,
    time: data.time, // ถ้าหลังบ้านต้อง HH:mm:ss ค่อยเติม :00 ที่ backend หรือปรับตรงนี้
    place: data.place || "",
    capacity: toNumberOrUndef(data.capacity),
    detail: data.detail,
    cost: toNumberOrUndef(data.cost),
    rating: toNumberOrUndef(data.rating),
    userId: data.userId ?? 18,
    // photo: (data.photo as string | File | null) ?? null, // เปิดเมื่อ API รองรับไฟล์
  };
}

export function toUpdateDtoFromForm(fd: FormData): UpdateEventDto {
  const toNumUndef = (v: any) =>
    v === undefined || v === null || v === "" ? undefined : Number(v);

  const eventDate = fd.get("eventDate");
  const date =
    typeof eventDate === "string" && eventDate ? eventDate : undefined;

  return {
    name: (fd.get("eventName") as string) || undefined,
    date,
    place: (fd.get("location") as string) || undefined,
    detail: (fd.get("details") as string) || undefined,
    capacity: toNumUndef(fd.get("capacity")),
  };
}

/* ---------- Helpers: SSR fetch ---------- */
export function buildEventUrl(id: number) {
  const base = (OpenAPI as any).BASE ?? (OpenAPI as any).BASE_URL ?? "";
  return `${base}/events/${id}`;
}
