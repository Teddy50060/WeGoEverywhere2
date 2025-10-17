// /components/form/shared/LocationInput.tsx
"use client";
import { MapPin } from "lucide-react";
import { FormInput } from "@/components/form/input/FormInput";

export function LocationInput({
  name = "location",          
  label = "Location",
  defaultValue,
  value,
  className,
}: {
  name?: string;
  label?: string;
  defaultValue?: string;
  value?: string;
  className?: string;
}) {

  return (
    <div className="mb-3 relative">
      <FormInput
        name={name}
        type="text"
        label={label}
        defaultValue={defaultValue}
        value={value}
        className={`!bg-[var(--color-brand-background)] rounded-full border-black/30 pr-10 ${
          className ?? ""
        }`}
      />
      <MapPin className="pointer-events-none absolute right-3 top-1/2 translate-y-[5px] h-4 w-4 text-neutral-600" />
    </div>
  );
}
