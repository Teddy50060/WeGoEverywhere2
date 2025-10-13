"use client";

import * as React from "react";
import { useActionState } from "react";
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

type EventView = {
  eventId: number;
  name: string;
  capacity: number;
  joined?: number; // ✅ เพิ่มไว้โชว์จำนวนผู้เข้าร่วม
  userId: number | string;
  date: string | null; // ISO หรือ yyyy-mm-dd
  time: string | null; // "HH:mm" (24 ชม.)
  place: string;
  detail: string;
  imageUrl: string;
  status?: string;
};

export default function EditEventFormClient({ event }: { event: EventView }) {
  const updateWrapper = async (
    _prev: EventActionState,
    formData: FormData
  ): Promise<EventActionState> =>
    updateEventWithZod(String(event.eventId), formData);

  const deleteWrapper = async (
    _prev: EventActionState,
    _formData: FormData
  ): Promise<EventActionState> => deleteEventById(String(event.eventId));

  const [updateState, updateFormAction] = useActionState(updateWrapper, {
    ok: false,
  });
  const [deleteState, deleteFormAction] = useActionState(deleteWrapper, {
    ok: false,
  });

  useActionToasts(updateState);
  useActionToasts(deleteState);

  return (
    <div className="font-alt">
      <div className="relative rounded-3xl border border-black/10 bg-[var(--color-brand-secondary)] p-4 shadow">
        <form
          id="updateForm"
          action={updateFormAction}
          className="px-1 pb-2 pt-2 text-sm"
        >
          <input type="hidden" name="id" value={event.eventId} />

          {/* Cover */}
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
          </div>

          {/* Fields */}
          <FormInput
            name="eventName"
            type="text"
            label="Event name"
            defaultValue={event.name}
            className="!bg-[var(--color-brand-background)] rounded-2xl border border-gray-300 text-sm text-gray-700"
            required
          />

          <div className="mb-3 grid grid-cols-5 gap-3">
            <div className="col-span-5 sm:col-span-3">
              <Calendar28
                name="date"
                label="Date"
                readonly
                className="!bg-[color:var(--color-brand-background)] rounded-2xl border border-gray-300 text-sm text-gray-700"
                defaultValue={event.date ? event.date : "-"}
              />
            </div>
            <div className="col-span-5 sm:col-span-2">
              <TimePicker
                name="time"
                label="Time"
                readOnly
                className="!bg-[color:var(--color-brand-background)] border border-gray-300 text-sm text-gray-700"
                defaultValue={event.time ? event.time : "-"}
              />
            </div>
          </div>

          <LocationInput
            defaultValue={event.place}
            className="!bg-[var(--color-brand-background)] rounded-2xl border border-gray-300 text-sm text-gray-700"
          />

          <TextAreaInput
            name="details"
            label="Details"
            defaultValue={event.detail}
            className="!bg-[var(--color-brand-background)] rounded-2xl border border-gray-300 text-sm text-gray-700"
          />
        </form>

        {/* Optional Row */}
        <div className="px-1 pb-6">
          <div className="flex items-center gap-2 pb-2">
            <span className="text-[13px] font-semibold text-black/80">
              Optional
            </span>
            <div className="h-px flex-1 bg-black/20" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormInput
              name="capacity"
              type="number"
              label="Capacity"
              className="!bg-[var(--color-brand-background)] rounded-full border-black/30"
              defaultValue={String(event.capacity)}
            />
            <StatusSelect
              name="status"
              options={[
                { value: "publish", label: "Publish" },
                { value: "unpublish", label: "Unpublish" },
              ]}
              defaultValue={event.status ? event.status : "publish"}
              formId="updateForm"
              className="!bg-[var(--color-brand-background)] rounded-full border border-black/30 text-sm"
            />
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-3 mt-3 items-center">
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
      </div>
    </div>
  );
}
