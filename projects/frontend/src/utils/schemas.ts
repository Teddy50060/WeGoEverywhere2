// /utils/schemas.ts
import { z } from "zod";

const toNumberOr = (fallback: number) => (v: unknown) => {
  if (v === "" || v == null) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

export const eventFormSchema = z.object({
  name: z.string().min(1, "Event name is required").max(100),
  date: z.string().trim().min(1, "date is require"),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use 24h time HH:mm"),
  place: z.string().trim().min(1, "location is require"),
  detail: z.string().min(1, "Detail is required"),
  capacity: z.preprocess(
    (v) => (v === "" || v == null ? 0 : Number(v)),
    z.number().int().min(1, "Capacity cannot be 0")
  ),

  cost: z
    .preprocess(toNumberOr(0), z.number().min(0, "Cost must be >= 0"))
    .transform((n) => Number(n.toFixed(2))),

  status: z.string().default("active"),
  rating: z.preprocess(toNumberOr(0), z.number().min(0)).default(0),

  photo: z
    .any()
    .transform((v) =>
      typeof File !== "undefined" && v instanceof File && v.size > 0 ? v : null
    )
    .nullable()
    .optional(),

  userId: z.number().optional(),
});
