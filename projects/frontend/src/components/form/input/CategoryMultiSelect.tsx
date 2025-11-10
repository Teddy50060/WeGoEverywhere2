"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
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

function colorOf(category: string) {
  switch (category) {
    case "Entertainment":
      return "bg-rose-100 text-rose-700 border-rose-200";
    case "Education":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "Health":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "Lifestyle":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Technology":
      return "bg-sky-100 text-sky-700 border-sky-200";
    case "Environment":
      return "bg-violet-100 text-violet-700 border-violet-200";
    default:
      return "bg-zinc-100 text-zinc-700 border-zinc-200";
  }
}

type Props = {
  name?: string;
  label?: string;
  defaultSelected?: CategoryOption[];
  max?: number;
  min?: number;
  required?: boolean;
};

export default function CategoryMultiSelect({
  name = "categories",
  label = "Categories",
  defaultSelected = [],
  max = 6,
  min = 1,
  required,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] =
    React.useState<CategoryOption[]>(defaultSelected);
  const [isTall, setIsTall] = React.useState(false);
  const btnRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (!btnRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const height = entry.contentRect.height;
      setIsTall(height > 60);
    });
    observer.observe(btnRef.current);
    return () => observer.disconnect();
  }, []);

  const toggle = (value: CategoryOption) => {
    setSelected((prev) => {
      if (prev.includes(value)) return prev.filter((v) => v !== value);
      if (prev.length >= max) return prev;
      return [...prev, value];
    });
  };

  const clear = (value: CategoryOption) => {
    setSelected((prev) => prev.filter((v) => v !== value));
  };

  return (
    <div className="w-full mb-3">
      <label className="text-sm font-semibold block mb-1">{label}</label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={btnRef}
            type="button"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "relative w-full h-auto min-h-10 items-start whitespace-normal border border-black/30 bg-[var(--color-brand-background)] hover:bg-[var(--color-brand-background)] py-2 pl-3 pr-9 text-left transition-all",
              isTall ? "rounded-2xl" : "rounded-3xl"
            )}
          >
            <div
              className={cn(
                "flex flex-wrap gap-2",
                selected.length === 0 && "text-muted-foreground"
              )}
            >
              {selected.length === 0 ? (
                <span>Select categories</span>
              ) : (
                selected.map((cat) => (
                  <Badge
                    key={cat}
                    className={cn(
                      "px-2 py-1 border rounded-full text-xs whitespace-nowrap flex items-center",
                      colorOf(cat)
                    )}
                  >
                    {cat}
                    <span
                      role="button"
                      tabIndex={0}
                      aria-label={`Remove ${cat}`}
                      title={`Remove ${cat}`}
                      className="ml-2 grid place-items-center rounded-full hover:bg-black/5 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        clear(cat);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();
                          clear(cat);
                        }
                      }}
                    >
                      <X className="size-3" />
                    </span>
                  </Badge>
                ))
              )}
            </div>

            <ChevronsUpDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-1 overflow-hidden bg-[var(--color-brand-background)] rounded-2xl border border-black/30 font-[var(--font-alt)] shadow-lg"
          align="end"
          alignOffset={-8}
          sideOffset={10}
        >
          <div className="px-3 py-2 text-sm font-medium text-center">
            Categories
          </div>

          <Command className="bg-transparent border-transparent">
            <CommandList className="max-h-64">
              <CommandEmpty className="py-4 text-center text-sm">
                No results found.
              </CommandEmpty>

              <CommandGroup className="px-1">
                {CATEGORY_OPTIONS.map((cat) => {
                  const isSelected = selected.includes(cat);
                  const disabled = !isSelected && selected.length >= max;

                  return (
                    <CommandItem
                      key={cat}
                      value={cat}
                      onSelect={() => toggle(cat)}
                      disabled={disabled}
                      className={cn(
                        "px-2 py-1 rounded-xl hover:bg-accent",
                        isSelected && "bg-accent font-medium",
                        disabled && "opacity-50"
                      )}
                    >
                      <div
                        className={cn(
                          "mr-2 flex items-center justify-center min-w-[1rem] min-h-[1rem] rounded-full border-2 leading-none",
                          isSelected
                            ? "border-[var(--color-brand-tertiary)]"
                            : "border-zinc-400/60 text-zinc-400/60"
                        )}
                      >
                        <span
                          className={cn(
                            "rounded-full transition-all duration-150",
                            isSelected
                              ? "block w-2 h-2 bg-[var(--color-brand-tertiary)]"
                              : "block w-0 h-0"
                          )}
                        />
                      </div>

                      <span className="leading-5">{cat}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selected.map((cat, idx) => (
        <input
          key={cat}
          type="hidden"
          name={name}
          value={cat}
          {...(idx === 0 && required ? { required: true } : {})}
        />
      ))}
    </div>
  );
}
