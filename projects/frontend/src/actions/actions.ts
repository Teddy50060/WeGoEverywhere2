"use server";

import { eventFormSchema } from "@/utils/schemas";
import { EventService } from "@/lib/api";
import {
  ensureAuthHeader,
  formToDbShape,
  mapErrorsToFormKeys,
  compactZodErrors,
  toCreateDto,
  toUpdateDtoFromForm,
  buildEventUrl,
} from "./helpers.action";

/* ---------- Types ---------- */
export type EventActionState = {
  ok: boolean;
  errors?: Record<string, string[]>;
  message?: string;
  next?: string;
};

/* ---------- Actions ---------- */
export const createEventWithZod = async (
  formData: FormData
): Promise<EventActionState> => {
  try {
    ensureAuthHeader();

    const candidate = formToDbShape(formData);
    const parsed = eventFormSchema.safeParse(candidate);
    if (!parsed.success) {
      const fieldErrors = mapErrorsToFormKeys(
        parsed.error.flatten().fieldErrors
      );
      return {
        ok: false,
        errors: fieldErrors,
        message: compactZodErrors(fieldErrors),
      };
    }

    const dataWithUser = { ...parsed.data, userId: 18 };
    const dto = toCreateDto(dataWithUser);
    console.log("createEventWithZod dto:", dto);

    await EventService.eventControllerCreate(dto);
    return { ok: true, message: "Event created successfully!" };
  } catch (error: any) {
    console.error("createEventWithZod error:", error);
    const status = error?.status ?? error?.statusCode;
    return {
      ok: false,
      message:
        status === 401
          ? "Unauthorized: ตรวจสอบ DEV_BEARER ใน .env และว่าเป็น access token ที่ยังไม่หมดอายุ"
          : error?.body?.message || error?.message || "Failed to create event.",
    };
  }
};

export const updateEventWithZod = async (
  id: string,
  formData: FormData
): Promise<EventActionState> => {
  try {
    ensureAuthHeader();

    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      return { ok: false, message: "Invalid event id" };
    }

    const dto = toUpdateDtoFromForm(formData);
    await EventService.eventControllerUpdate(numericId, dto);

    const nextVal = formData.get("next");
    const next = typeof nextVal === "string" && nextVal ? nextVal : undefined;
    return { ok: true, message: "Event updated!", next };
  } catch (error: any) {
    const status = error?.status ?? error?.statusCode;
    return {
      ok: false,
      message:
        status === 401
          ? "Unauthorized: ตรวจสอบ DEV_BEARER ใน .env"
          : error?.body?.message || error?.message || "Unknown error",
    };
  }
};

export const deleteEventById = async (
  id: string
): Promise<EventActionState> => {
  try {
    ensureAuthHeader();

    const numericId = Number(id);
    if (Number.isNaN(numericId))
      return { ok: false, message: "Invalid event id" };
    await EventService.eventControllerSoftDelete(numericId);
    return { ok: true, message: "Event deleted!" };
  } catch (error: any) {
    const status = error?.status ?? error?.statusCode;
    return {
      ok: false,
      message:
        status === 401
          ? "Unauthorized: ตรวจสอบ DEV_BEARER ใน .env"
          : error?.body?.message || error?.message || "Unknown error",
    };
  }
};

/** ---------- Data loader (SSR) ---------- */
export async function getEventById(id: number) {
  const auth = ensureAuthHeader();
  const url = buildEventUrl(id);

  const res = await fetch(url, {
    cache: "no-store",
    headers: { Authorization: auth },
  });
  if (!res.ok) {
    throw new Error(
      `Fetch event ${id} failed: ${res.status} ${res.statusText}`
    );
  }
  return res.json();
}
