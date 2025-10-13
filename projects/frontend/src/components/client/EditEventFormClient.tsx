// projects/frontend/src/components/client/EditEventFormClient.tsx
"use client";

import * as React from "react";
import { useActionState, useRef } from "react";
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

type EventView = {
  eventId: number;
  name: string;
  capacity: number;
  joined?: number;
  userId: number | string;
  date: string | null;
  time: string | null;
  place: string;
  detail: string;
  imageUrl: string;
  status?: string;
};

export default function EditEventFormClient({ event }: { event: EventView }) {
  const formRef = useRef<HTMLFormElement>(null);
  const updateWrapper = async (
    _prev: EventStateWithFields<EventActionState>,
    formData: FormData
  ): Promise<EventStateWithFields<EventActionState>> => {
    try {
      const res = await updateEventWithZod(String(event.eventId), formData);
      const nextState: EventStateWithFields<EventActionState> = {
        ...(res ?? { ok: false }),
        fields: toFields(formData),
      };

      if (nextState.ok) {
        console.log("✅ Event updated successfully!");
      }
      return nextState;
    } catch (err) {
      console.error(err);
      return { ok: false, errors: {}, fields: toFields(formData) };
    }
  };

  const deleteWrapper = async (
    _prev: EventActionState,
    _formData: FormData
  ): Promise<EventActionState> => deleteEventById(String(event.eventId));

  const [state, formAction] = useActionState<
    EventStateWithFields<EventActionState>,
    FormData
  >(updateWrapper, { ok: false, fields: {} });

  const [deleteState, deleteFormAction] = useActionState(deleteWrapper, {
    ok: false,
  });

  const f = state.fields ?? {};

  useActionToasts(state?.ok ? state : undefined, {
    successText: "Event updated successfully!",
  });
  useActionToasts(deleteState);

  return (
    <>
      <div className="font-alt relative rounded-3xl border border-black/10 bg-[var(--color-brand-secondary)] p-4 shadow text-sm">
        <form ref={formRef} id="updateForm" action={formAction} noValidate>
          <input type="hidden" name="id" value={event.eventId} />
          <div className="mb-4">
            <EventPhotoPicker
              name="photo"
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
            defaultValue={f.location ?? event.place}
            className="!bg-[var(--color-brand-background)] rounded-2xl border border-gray-300 text-sm text-gray-700"
          />
          <FieldError errors={state?.errors?.location} />
          <TextAreaInput
            name="details"
            label="Details"
            defaultValue={f.details ?? event.detail}
            className="!bg-[var(--color-brand-background)] rounded-2xl border border-gray-300 text-sm text-gray-700"
          />
          <FieldError errors={state?.errors?.details} />
          <div className="mt-4 flex items-center gap-2 pb-2">
            <span className="text-[13px] font-semibold text-black/80">
              Optional
            </span>
            <div className="h-px flex-1 bg-black/20" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FormInput
                name="capacity"
                type="number"
                label="Capacity"
                className="!bg-[var(--color-brand-background)] rounded-full border-black/30"
                defaultValue={f.capacity ?? event.capacity}
              />
              <FieldError errors={state?.errors?.capacity} />
            </div>

            <div>
              <StatusSelect
                name="status"
                label="Status"
                options={[
                  { value: "publish", label: "Publish" },
                  { value: "unpublish", label: "Unpublish" },
                ]}
                defaultValue={(f.status as string) ?? event.status ?? "publish"}
                formId="updateForm"
                className="!bg-[var(--color-brand-background)] rounded-full border border-black/30 text-sm"
              />
              <FieldError errors={state?.errors?.status} />
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
