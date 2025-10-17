"use client";

import * as React from "react";
import { Clock } from "lucide-react";

import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import clsx from "clsx";

export type TimePickerProps = {
  name: string;
  label?: string;
  defaultValue?: string; // "HH:mm"
  className?: string;
  required?: boolean;
  readOnly?: boolean;
  /** ปิดการพิมพ์ในช่องแสดงผล (ยังเลือกจาก popup ได้) */
  disableTyping?: boolean;
  /** นาทีต่อสเต็ป (เช่น 5, 10, 15) */
  minuteStep?: number;
  onChange?: (time: string | undefined) => void; // "HH:mm"
};

function clampHHMM(raw?: string): string | undefined {
  if (!raw) return undefined;
  const m = raw.match(/^(\d{1,2}):(\d{1,2})$/);
  if (!m) return undefined;
  let h = Number(m[1]);
  let mi = Number(m[2]);
  if (isNaN(h) || isNaN(mi)) return undefined;
  if (h < 0 || h > 23 || mi < 0 || mi > 59) return undefined;
  return `${String(h).padStart(2, "0")}:${String(mi).padStart(2, "0")}`;
}

export const TimePicker = React.forwardRef<HTMLInputElement, TimePickerProps>(
  (
    {
      name,
      label,
      defaultValue = "00:00",
      className = "",
      required = false,
      readOnly = false,
      disableTyping = true,
      minuteStep = 5,
      onChange,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const init = clampHHMM(defaultValue) ?? "00:00";
    const [value, setValue] = React.useState<string>(init);

    const [hour, minute] = value.split(":");

    const hours = React.useMemo(
      () => Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0")),
      []
    );
    const minutes = React.useMemo(() => {
      const arr: string[] = [];
      for (let m = 0; m < 60; m += Math.max(1, minuteStep)) {
        arr.push(String(m).padStart(2, "0"));
      }
      return arr;
    }, [minuteStep]);

    const handleSelect = (h: string, m: string) => {
      const next = `${h}:${m}`;
      setValue(next);
      setOpen(false);
      onChange?.(next);
    };

    return (
      <div className="mb-2">
        {label && (
          <Label
            htmlFor={`${name}Display`}
            className="text-sm font-semibold block mb-1"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        )}

        {/* ส่งค่าไป backend จริง */}
        <input
          ref={ref}
          type="hidden"
          name={name}
          value={value}
          required={required}
          readOnly={readOnly}
        />

        <div className="relative">
          {/* ช่องที่ผู้ใช้เห็น (ใช้สไตล์หลักของคุณ) */}
          <Input
            id={`${name}Display`}
            name={`${name}Display`}
            value={value}
            placeholder="00:00"
            readOnly={readOnly || disableTyping}
            required={required}
            className={clsx(
              `pr-10 mt-1 w-full rounded-2xl border border-black 
               px-4 py-2.5 text-sm focus:border-[#EB6223] focus:outline-none 
               focus:ring-2 focus:ring-[#EB6223]/20`,
              className,
              "focus-visible:ring-offset-0 focus-visible:ring-1"
            )}
            onChange={(e) => {
              if (readOnly || disableTyping) return;
              const raw = e.target.value;
              const ok = clampHHMM(raw);
              if (ok) {
                setValue(ok);
                onChange?.(ok);
              }
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
                aria-label="Select time"
              >
                <Clock className="size-3.5" />
              </Button>
            </PopoverTrigger>

            {/* popup ให้หน้าตาตรงกับ Calendar28 */}
            <PopoverContent
              className="
                w-[300px] p-0 overflow-hidden
                bg-[var(--color-brand-background)]
                rounded-2xl border border-black/30
                font-[var(--font-alt)] shadow-lg
              "
              align="end"
              alignOffset={-8}
              sideOffset={10}
            >
              {/* header จัดกลาง ไม่มีเส้นคั่น */}
              <div className="grid grid-cols-2 text-sm font-medium text-center">
                <div className="px-3 py-2 bg-[var(--color-brand-background)]">
                  Hour
                </div>
                <div className="px-3 py-2 bg-[var(--color-brand-background)]">
                  Minute
                </div>
              </div>

              {/* เลื่อนอิสระ + ซ่อน scrollbar */}
              <div className="grid grid-cols-2">
                <div className="max-h-60 overflow-y-auto scrollbar-hide">
                  {hours.map((h) => (
                    <button
                      key={h}
                      onClick={() => handleSelect(h, minute)}
                      className={clsx(
                        "w-full h-9 px-3 flex items-center justify-center text-sm hover:bg-accent rounded-r-full",
                        h === hour && "bg-accent font-semibold"
                      )}
                    >
                      {h}
                    </button>
                  ))}
                </div>

                <div className="max-h-60 overflow-y-auto scrollbar-hide">
                  {minutes.map((m) => (
                    <button
                      key={m}
                      onClick={() => handleSelect(hour, m)}
                      className={clsx(
                        "w-full h-9 px-3 flex items-center justify-center text-sm hover:bg-accent rounded-l-full",
                        m === minute && "bg-accent font-semibold"
                      )}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    );
  }
);

TimePicker.displayName = "TimePicker";
