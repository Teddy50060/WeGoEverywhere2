"use client";

import * as React from "react";
import { useActionState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import EventPhotoPicker from "@/components/form/EventPhotoPicker";
import { FormInput } from "@/components/form/input/FormInput";
import { TextAreaInput } from "@/components/form/input/TextAreaInout";
import { Calendar28 } from "@/components/form/input/DatePicker";
import {
  updateEventWithZod,
  deleteEventById,
  type EventActionState,
} from "@/actions/actions";
import DeleteButton from "@/components/form/input/deletebutton";
import { useActionToasts } from "../form/useActionToasts";
import { LocationInput } from "../form/input/LocationInput";
import { StatusSelect } from "../form/input/StatusSelect";
import { TimePicker } from "../form/input/TimePicker";
import { FieldError } from "../form/FieldError";
import { toFields, type EventStateWithFields } from "@/lib/forms";
import { uiFromApiStatus } from "@/utils/statusMapper";

type EventView = {
  eventId: number;
  name: string;
  capacity: number;
  joined?: number;
  userId: number | string;
  date: string | null; // 'YYYY-MM-DD'
  time: string | null; // 'HH:mm'
  place: string;
  detail: string;
  imageUrl: string;
  status?: string;
};

export default function EditEventFormClient({ event }: { event: EventView }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const didSubmitUpdateRef = useRef(false);
  const lastUpdateToastSigRef = useRef<string | null>(null);
  const didSubmitDeleteRef = useRef(false);
  const lastDeleteToastSigRef = useRef<string | null>(null);

  const updateWrapper = async (
    _prev: EventStateWithFields<EventActionState>,
    formData: FormData
  ): Promise<EventStateWithFields<EventActionState>> => {
    didSubmitUpdateRef.current = true;
    lastUpdateToastSigRef.current = null;

    try {
      const res = await updateEventWithZod(String(event.eventId), formData);
      const nextState: EventStateWithFields<EventActionState> = {
        ...(res ?? { ok: false }),
        fields: toFields(formData),
        message: undefined,
      };
      return nextState;
    } catch (err) {
      console.error(err);
      return {
        ok: false,
        errors: {},
        fields: toFields(formData),
        message: undefined,
      };
    }
  };

  const deleteWrapper = async (
    _prev: EventActionState,
    _formData: FormData
  ): Promise<EventActionState> => {
    didSubmitDeleteRef.current = true;
    lastDeleteToastSigRef.current = null;
    try {
      const res = await deleteEventById(String(event.eventId));
      return { ...(res ?? { ok: false }), message: undefined };
    } catch (err) {
      console.error(err);
      return { ok: false, message: undefined };
    }
  };

  const [state, formAction] = useActionState<
    EventStateWithFields<EventActionState>,
    FormData
  >(updateWrapper, { ok: false, fields: {} });

  const [deleteState, deleteFormAction] = useActionState(deleteWrapper, {
    ok: false,
  });

  const f = state.fields ?? {};

  const updateToastState = useMemo(() => {
    if (!didSubmitUpdateRef.current || !state) return undefined;
    const effective = { ...state, message: undefined };
    const sig = effective.ok ? "S" : "E";
    if (lastUpdateToastSigRef.current === sig) return undefined;
    lastUpdateToastSigRef.current = sig;
    return effective;
  }, [state]);

  const deleteToastState = useMemo(() => {
    if (!didSubmitDeleteRef.current || !deleteState) return undefined;
    const effective = { ...deleteState, message: undefined };
    const sig = effective.ok ? "S" : "E";
    if (lastDeleteToastSigRef.current === sig) return undefined;
    lastDeleteToastSigRef.current = sig;
    return effective;
  }, [deleteState]);

  useActionToasts(updateToastState, {
    successText: "Event updated successfully!",
    errorText: "Failed to update event.",
    onSuccess: () => {
      // router.refresh(); // รีเฟรช server components บนหน้านี้
      router.push("/event");
    },
  });

  useActionToasts(deleteToastState, {
    successText: "Event deleted.",
    errorText: "Failed to delete event.",
    onSuccess: () => {
      router.push("/event");
    },
  });

  return (
    <>
      <div className="font-alt relative rounded-3xl border border-black/10 bg-[var(--color-brand-secondary)] p-4 shadow text-sm">
        <form ref={formRef} id="updateForm" action={formAction} noValidate>
          <input type="hidden" name="id" value={event.eventId} />

          <div className="mb-4">
            <EventPhotoPicker
              name="eventPhoto"
              value={event.imageUrl}
              linkText="Change your event photo"
              size={208}
              width={280}
              rounded="2xl"
              className="mx-auto"
            />
            <FieldError errors={state?.errors?.photo} />
          </div>

          <FormInput
            name="eventName"
            type="text"
            label="Event name"
            className="!bg-[var(--color-brand-background)] rounded-2xl border border-gray-300 text-sm text-gray-700"
            defaultValue={f.eventName ?? event.name}
          />
          <FieldError errors={state?.errors?.eventName} />

          <div className="mb-3 grid grid-cols-5 gap-3">
            <div className="col-span-5 sm:col-span-3">
              <Calendar28
                name="eventDate"
                label="Event date"
                readonly
                className="!bg-[var(--color-brand-background)] rounded-2xl border border-gray-300 text-sm text-gray-700"
                defaultValue={f.eventDate ?? event.date ?? ""}
              />
              <FieldError errors={state?.errors?.eventDate} />
            </div>

            <div className="col-span-5 sm:col-span-2">
              <TimePicker
                name="eventTime"
                label="Time"
                readOnly
                className="!bg-[var(--color-brand-background)] border border-gray-300 text-sm text-gray-700"
                defaultValue={f.eventTime ?? event.time ?? "00:00"}
              />
              <FieldError errors={state?.errors?.eventTime} />
            </div>
          </div>

          <LocationInput
            name="eventLocation"
            label="Location"
            defaultValue={f.eventLocation ?? event.place ?? ""}
            className="!bg-[var(--color-brand-background)] rounded-2xl border border-gray-300 text-sm text-gray-700"
          />
          <FieldError errors={state?.errors?.eventLocation} />

          <TextAreaInput
            name="eventDetails"
            label="Details"
            defaultValue={f.eventDetails ?? event.detail}
            className="!bg-[var(--color-brand-background)] rounded-2xl border border-gray-300 text-sm text-gray-700"
          />
          <FieldError errors={state?.errors?.eventDetails} />

          <div className="mt-4 flex items-center gap-2 pb-2">
            <span className="text-[13px] font-semibold text-black/80">
              Optional
            </span>
            <div className="h-px flex-1 bg-black/20" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FormInput
                name="eventCapacity"
                type="number"
                label="Capacity"
                className="!bg-[var(--color-brand-background)] rounded-full border-black/30"
                defaultValue={f.eventCapacity ?? event.capacity}
              />
              <FieldError errors={state?.errors?.eventCapacity} />
            </div>

            <div>
              <StatusSelect
                name="eventStatus"
                label="Status"
                options={[
                  { value: "publish", label: "Publish" },
                  { value: "unpublish", label: "Unpublish" },
                ]}
                defaultValue={
                  (f.eventStatus as string) ?? uiFromApiStatus(event.status)
                }
                formId="updateForm"
                className="!bg-[var(--color-brand-background)] rounded-full border border-black/30 text-sm"
              />
              <FieldError errors={state?.errors?.eventStatus} />
            </div>
          </div>
        </form>

        <div className="grid grid-cols-[1fr_auto] gap-3 mt-4 items-center">
          <button
            form="updateForm"
            type="submit"
            className="h-11 w-full rounded-full bg-[var(--color-brand-greenbutton)] text-sm font-semibold"
          >
            Save
          </button>
          <DeleteButton action={deleteFormAction} />
        </div>
      </div>
    </>
  );
}
