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
import { time } from "console";

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
    console.log(
      "updateEventWithZod formData:",
      Object.fromEntries(formData.entries())
    );

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
    console.log("deleteEventById id:", id);

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

export async function getAllEvents() {
  ensureAuthHeader();
  return EventService.eventControllerGetAll();
}

/*ใช้ชั่วคราวรอ BE เขียน service*/
export async function getEventById(id: number) {
  const eventData = {
    id: id,
    name: "YoGa's Garden",
    date: "2025-11-12T00:00:00.000Z",
    place: "Lumpini Park",
    detail:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Recusandae at tenetur sed odio eaque culpa rerum laboriosam beatae voluptate sint doloribus nisi tempore nihil ipsa mollitia pariatur expedita, quisquam consequuntur debitis hic optio voluptates? Facere, commodi porro ad consequatur eum tenetur nostrum voluptas doloribus omnis rem tempora assumenda itaque, aliquid quas!",
    capacity: 150,
    status: "publish",
    time: "13:00",
    userId: 18,
  };
  return eventData;
}

export async function logUserRegisteredEvent(
  userId: number | string,
  eventId: number | string
) {
  console.log(`UserID:${userId} has registered to eventID:${eventId}`);
}

export async function logUserReportEvent(
  userId: number | string,
  eventId: number | string
) {
  console.log(`UserID:${userId} has reported eventID:${eventId}`);
}
