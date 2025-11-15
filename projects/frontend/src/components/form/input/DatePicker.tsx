"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "../../ui/button";
import { Calendar } from "../../ui/calendar";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";

type Calendar28Props = {
  name: string;
  label?: string;
  defaultValue?: string; // เช่น "2025-06-01" หรือ "June 01, 2025"
  initialDate?: Date;
  placeholder?: string;
  readonly?: boolean;
  className?: string;
  required?: boolean;
  disableTyping?: boolean;
  onChange?: (date: Date | undefined, displayText: string) => void;
};

/** แปลง Date → “October 02, 2025” (ไว้แสดงผลในช่อง) */
function formatDateDisplay(date: Date | undefined) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/** แปลง Date → “YYYY-MM-DD” (ไว้ส่งให้ backend) */
function formatYYYYMMDD(date: Date | undefined) {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** แปลง string → Date รองรับหลาย format */
function parseDateFlexible(value?: string): Date | undefined {
  if (!value) return undefined;
  const d1 = new Date(value);
  if (!isNaN(d1.getTime())) return d1;

  const mdy = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (mdy) {
    const m = Number(mdy[1]);
    const d = Number(mdy[2]);
    const y = Number(mdy[3]);
    const d2 = new Date(y, m - 1, d);
    if (!isNaN(d2.getTime())) return d2;
  }
  return undefined;
}

export const Calendar28 = (props: Calendar28Props) => {
  const {
    name,
    label,
    defaultValue,
    initialDate,
    placeholder = "June 01, 2025",
    readonly = false,
    className = "",
    required = false,
    disableTyping = false,
    onChange,
  } = props;

  // เริ่มต้นค่า date
  const initDate =
    initialDate && !isNaN(initialDate.getTime())
      ? initialDate
      : parseDateFlexible(defaultValue);

  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(initDate);
  const [month, setMonth] = React.useState<Date | undefined>(initDate);
  const [display, setDisplay] = React.useState<string>(
    defaultValue ?? formatDateDisplay(initDate)
  );

  React.useEffect(() => {
    if (initialDate && !isNaN(initialDate.getTime())) {
      setDate(initialDate);
      setMonth(initialDate);
      const disp = formatDateDisplay(initialDate);
      setDisplay(disp);
      onChange?.(initialDate, disp);
      return;
    }
    if (typeof defaultValue === "string") {
      const d = parseDateFlexible(defaultValue);
      setDate(d);
      setMonth(d);
      setDisplay(formatDateDisplay(d));
      onChange?.(d, formatDateDisplay(d));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDate, defaultValue]);

  const handleSelect = (d?: Date) => {
    setDate(d);
    const disp = formatDateDisplay(d);
    setDisplay(disp);
    setOpen(false);
    onChange?.(d, disp);
  };

  return (
    <div className="mb-2">
      {label && (
        <Label
          htmlFor={`${name}Display`}
          className="text-sm font-semibold block mb-1"
        >
          {label}
        </Label>
      )}
      {/* hidden input ตัวนี้คือค่าที่ส่งไปจริง (YYYY-MM-DD) */}
      <input type="hidden" name={name} value={formatYYYYMMDD(date)} />

      <div className="relative">
        {/* ช่องให้ผู้ใช้เห็น */}
        <Input
          id={`${name}Display`}
          name={`${name}Display`}
          value={display}
          placeholder={placeholder}
          className={`pr-10 ${className} focus-visible:ring-offset-0 focus-visible:ring-1`}
          readOnly={readonly || disableTyping}
          required={required}
          onChange={(e) => {
            if (readonly || disableTyping) return;
            const raw = e.target.value;
            setDisplay(raw);
            const d = parseDateFlexible(raw);
            if (d) {
              setDate(d);
              setMonth(d);
            } else {
              setDate(undefined);
            }
            onChange?.(d, raw);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
              aria-label="Select date"
            >
              <CalendarIcon className="size-3.5" />
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className="w-auto overflow-hidden p-3 
             bg-[var(--color-brand-background)] 
             rounded-2xl border border-black/30 
             font-[var(--font-alt)] shadow-lg"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
              <Calendar
                mode="single"
                captionLayout="dropdown"
                fromYear={new Date().getFullYear()}
                toYear={new Date().getFullYear() + 2}
                fromDate={new Date()}
                toDate={(() => { const d = new Date(); d.setFullYear(d.getFullYear() + 2); return d; })()}
                selected={date}
                month={month}
                onMonthChange={setMonth}
                onSelect={handleSelect}
                initialFocus
              />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
