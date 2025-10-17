"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CATEGORY_OPTIONS, type CategoryOption } from "@/utils/schemas";

type Props = {
  name?: string; // default: "categories"
  label?: string; // label บนปุ่ม
  placeholder?: string; // คำค้น
  defaultSelected?: CategoryOption[]; // สำหรับหน้า Edit
  max?: number; // default 6
  min?: number; // default 1 (ใช้ validate ที่ zod เป็นหลัก)
  required?: boolean; // ให้ browser ช่วยเตือน (ใส่กับ hidden input ตัวแรก)
};

export default function CategoryMultiSelect({
  name = "categories",
  label = "Select categories",
  placeholder = "Search categories...",
  defaultSelected = [],
  max = 6,
  min = 1,
  required,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] =
    React.useState<CategoryOption[]>(defaultSelected);

  const toggle = (value: CategoryOption) => {
    setSelected((prev) => {
      if (prev.includes(value)) {
        return prev.filter((v) => v !== value);
      }
      if (prev.length >= max) {
        return prev; // ไม่เพิ่มเกิน max
      }
      return [...prev, value];
    });
  };

  const clear = (value: CategoryOption) => {
    setSelected((prev) => prev.filter((v) => v !== value));
  };

  const selectedText =
    selected.length === 0
      ? "None"
      : selected.length === 1
      ? selected[0]
      : `${selected[0]} +${selected.length - 1}`;

  return (
    <div className="w-full">
      {/* ปุ่มเปิดปิด Popover */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="truncate">
              {label}: <span className="font-normal">{selectedText}</span>
            </span>
            <ChevronsUpDown className="ml-2 size-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {CATEGORY_OPTIONS.map((cat) => {
                  const isSelected = selected.includes(cat);
                  const disabled = !isSelected && selected.length >= max;
                  return (
                    <CommandItem
                      key={cat}
                      value={cat}
                      onSelect={() => toggle(cat)}
                      disabled={disabled}
                      className={cn(disabled && "opacity-50")}
                    >
                      <div
                        className={cn(
                          "mr-2 flex size-4 items-center justify-center rounded-sm border",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50"
                        )}
                      >
                        {isSelected && <Check className="size-3.5" />}
                      </div>
                      <span>{cat}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* badges + ปุ่มลบแต่ละอัน */}
      {selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selected.map((cat) => (
            <Badge key={cat} variant="secondary" className="pr-1">
              {cat}
              <button
                type="button"
                onClick={() => clear(cat)}
                className="ml-1 grid place-items-center rounded-full hover:bg-muted/70"
                aria-label={`Remove ${cat}`}
              >
                <X className="size-3.5" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* hidden inputs → ส่งกลับให้ server action */}
      {selected.map((cat, idx) => (
        <input
          key={cat}
          type="hidden"
          name={name}
          value={cat}
          {...(idx === 0 && required ? { required: true } : {})}
        />
      ))}

      {/* hint เกี่ยวกับ min/max (optional UI) */}
      <p className="mt-1 text-xs text-muted-foreground">
        Pick {min}–{max} categories.
      </p>
    </div>
  );
}
