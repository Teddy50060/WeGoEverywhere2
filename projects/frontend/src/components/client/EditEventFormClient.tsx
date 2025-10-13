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

type Existing = {
  photoUrl: string;
  name: string;
  dateString: string;
  location: string;
  details: string;
  capacity: number;
  status: "publish" | "unpublish";
};

export default function EditEventFormClient({
  id,
  existing,
}: {
  id: string;
  existing: Existing;
}) {
  const updateWrapper = async (
    _prev: EventActionState,
    formData: FormData
  ): Promise<EventActionState> => updateEventWithZod(id, formData);

  const deleteWrapper = async (
    _prev: EventActionState,
    _formData: FormData
  ): Promise<EventActionState> => deleteEventById(id);

  const [updateState, updateFormAction] = useActionState(updateWrapper, {
    ok: false,
  });
  const [deleteState, deleteFormAction] = useActionState(deleteWrapper, {
    ok: false,
  });

  useActionToasts(updateState);
  useActionToasts(deleteState);

  return (
    <div className="relative rounded-[28px] border border-black/50 bg-[var(--color-brand-secondary)] shadow-[0_6px_0_#00000020] z-10">
      <form
        id="updateForm"
        action={updateFormAction}
        className="px-4 pb-2 pt-10 text-sm"
      >
        <input type="hidden" name="id" value={id} />
        <div className="mb-4">
          <EventPhotoPicker
            name="photo"
            value={existing.photoUrl}
            linkText="Change your event photo"
            size={208}
            width={280}
            rounded="2xl"
            className="mx-auto"
          />
        </div>
        <FormInput
          name="eventName"
          type="text"
          label="Event name"
          defaultValue={existing.name}
        />
        <Calendar28
          name="eventDate"
          label="Event date"
          defaultValue={existing.dateString}
          initialDate={new Date(existing.dateString)}
          required
        />
        <LocationInput defaultValue={existing.location} />
        <TextAreaInput
          name="details"
          label="Details"
          defaultValue={existing.details}
        />
      </form>
      <div className="px-4 pb-6">
        <div className="flex items-center gap-2 pb-2">
          <span className="text-[13px] font-semibold text-black/80">
            Optional
          </span>
          <div className="h-px flex-1 bg-black/30" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input
            form="updateForm"
            name="capacity"
            type="number"
            defaultValue={String(existing.capacity)}
            className="mt-1 h-11 w-full rounded-full border border-black/30"
          />
          <StatusSelect
            name="status"
            options={[
              { value: "publish", label: "Publish" },
              { value: "unpublish", label: "Unpublish" },
            ]}
            defaultValue={existing.status}
            formId="updateForm"
          />
        </div>
        <div className="grid grid-cols-[1fr_auto] gap-3 mt-3 items-center">
          <button
            form="updateForm"
            type="submit"
            className="h-11 w-full rounded-full bg-[var(--color-brand-greenbutton)]"
          >
            Save
          </button>
          <DeleteButton action={deleteFormAction} />
        </div>
      </div>
    </div>
  );
}
