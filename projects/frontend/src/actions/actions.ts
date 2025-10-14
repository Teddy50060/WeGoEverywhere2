"use server";

import { eventFormSchema } from "@/utils/schemas";
import { EventService, UserService } from "@/lib/api";
import {
  formToDbShape,
  mapErrorsToFormKeys,
  compactZodErrors,
  toCreateDto,
  toUpdateDtoFromForm,
  buildEventUrl,
} from "./helpers.action";
import { setOpenApiCookieHeader } from "@/lib/auth/CookieHeader";

export type EventActionState = {
  ok: boolean;
  errors?: Record<string, string[]>;
  message?: string;
  next?: string;
};

export async function fetchMe() {
  try {
    await setOpenApiCookieHeader();
    const me = await UserService.userControllerGetMe();
    return { ok: true, data: me };
  } catch (err: any) {
    console.error("Error fetching user info:", err);
    return { ok: false, message: err?.message || "Failed to fetch user info" };
  }
}

export const createEventWithZod = async (
  formData: FormData
): Promise<EventActionState> => {
  try {
    await setOpenApiCookieHeader();

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

    const meRes = await fetchMe();
    if (!meRes.ok || !meRes.data) {
      return { ok: false, message: "Not authenticated" };
    }
    const raw = meRes.data as any;
    const userId: number | undefined = Number(
      raw?.userId ?? raw?.id ?? raw?.user?.id
    );
    if (!userId || Number.isNaN(userId)) {
      return { ok: false, message: "Cannot determine user id" };
    }

    const dto = toCreateDto(parsed.data, userId);
    console.log("createEventWithZod dto:", dto);

    await EventService.eventControllerCreate(dto);
    return { ok: true, message: "Event created successfully!" };
  } catch (error: any) {
    console.error("createEventWithZod error:", error);
    const status = error?.status ?? error?.statusCode;
    return {
      ok: false,
      message:
        error?.body?.message || error?.message || "Failed to create event.",
    };
  }
};

export const updateEventWithZod = async (
  id: string,
  formData: FormData
): Promise<EventActionState> => {
  try {
    await setOpenApiCookieHeader();

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
        error?.body?.message || error?.message || "Failed to create event.",
    };
  }
};

export const deleteEventById = async (
  id: string
): Promise<EventActionState> => {
  try {
    await setOpenApiCookieHeader();

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
        error?.body?.message || error?.message || "Failed to Delete event.",
    };
  }
};

export async function getEventById(id: number) {
  const auth = await setOpenApiCookieHeader();
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
