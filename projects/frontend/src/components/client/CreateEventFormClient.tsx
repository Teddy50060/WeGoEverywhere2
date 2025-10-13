// /components/form/CreateEventFormClient.tsx
"use client";
import * as React from "react";
import { useActionState, useRef } from "react";
import { createEventWithZod, type EventActionState } from "@/actions/actions";
import EventPhotoPicker from "@/components/form/EventPhotoPicker";
import { Calendar28 } from "@/components/form/input/DatePicker";
import { TextAreaInput } from "@/components/form/input/TextAreaInout";
import { SubmitButton } from "@/components/form/Buttons";
import { toFields, type EventStateWithFields } from "@/lib/forms";
import { FieldError } from "../form/FieldError";
import { LocationInput } from "../form/input/LocationInput";
import { FormInput } from "../form/input/FormInput";
import { StatusSelect } from "../form/input/StatusSelect";
import { useActionToasts } from "../form/useActionToasts";
import { TimePicker } from "../form/input/TimePicker";

export default function CreateEventFormClient() {
  const formRef = useRef<HTMLFormElement>(null);

  const createWrapper = async (
    _prev: EventStateWithFields<EventActionState>,
    formData: FormData
  ): Promise<EventStateWithFields<EventActionState>> => {
    try {
      const res = await createEventWithZod(formData);

      const nextState: EventStateWithFields<EventActionState> = {
        ...(res ?? { ok: false }),
        fields: toFields(formData),
      };

      if (nextState.ok) {
        formRef.current?.reset();
      }
      return nextState;
    } catch (err) {
      console.error(err);
      return { ok: false, errors: {}, fields: toFields(formData) };
    }
  };

  const [state, formAction] = useActionState<
    EventStateWithFields<EventActionState>,
    FormData
  >(createWrapper, { ok: false, fields: {} });

  const f = state.fields ?? {};

  useActionToasts(state?.ok ? state : undefined, {
    successText: "Event created successfully!",
    onSuccess: () => formRef.current?.reset(),
  });

  return (
    <form
      ref={formRef}
      action={formAction}
      className="px-4 pb-6 pt-10 text-sm"
      noValidate
    >
      {/* Photo */}
      <div className="mb-4">
        <EventPhotoPicker
          name="photo"
          size={208}
          rounded="2xl"
          bgClassName="bg-gray-300"
        />
        <FieldError errors={state?.errors?.photo} />
      </div>
      <FormInput
        name="eventName"
        type="text"
        label="Event name"
        className="!bg-[var(--color-brand-background)] rounded-full border-black/30"
        defaultValue={f.eventName}
      />
      <FieldError errors={state?.errors?.eventName} />
      {/* Event date + Time */}
      <div className="mb-3 grid grid-cols-5 gap-3">
        <div className="col-span-5 sm:col-span-3">
          <Calendar28
            name="eventDate"
            label="Event date"
            placeholder="Month DD,YYYY"
            required
            className="!bg-[var(--color-brand-background)] rounded-full border-black/30 h-10"
            disableTyping
            defaultValue={f.eventDate}
          />
          <FieldError errors={state?.errors?.eventDate} />
        </div>

        <div className="col-span-5 sm:col-span-2">
          <TimePicker
            name="eventTime"
            label="Time"
            defaultValue="00:00"
            className="!bg-[var(--color-brand-background)] rounded-full border-black/30 h-10"
          />
          <FieldError errors={state?.errors?.time} />
        </div>
      </div>

      <LocationInput defaultValue={f.location} />
      <FieldError errors={state?.errors?.location} />

      <TextAreaInput
        name="details"
        label="Details"
        className="block w-full h-22 overflow-y-auto rounded-[20px] border border-black/30 !bg-[var(--color-brand-background)] resize-none focus:border-black"
        defaultValue={f.details}
      />
      <FieldError errors={state?.errors?.details} />

      {/* Optional*/}
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[13px] font-semibold text-neutral-700">
          Optional
        </span>
        <div className="h-[1px] flex-1 bg-black/20" />
      </div>

      {/* Capacity / Status */}
      <div className="mb-3 grid grid-cols-2 gap-3">
        <div>
          <FormInput
            name="capacity"
            type="number"
            label="Capacity"
            className="!bg-[var(--color-brand-background)] rounded-full border-black/30"
            defaultValue={f.capacity}
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
            defaultValue={(f.status as string) ?? "publish"}
          />
          <FieldError errors={state?.errors?.status} />
        </div>
      </div>

      <SubmitButton
        text="Save !"
        size="lg"
        className="w-full rounded-full border border-black/40 bg-[var(--color-brand-greenbutton)] px-6 py-3 font-medium shadow-[0_2px_0_#00000020]"
      />
    </form>
  );
}
