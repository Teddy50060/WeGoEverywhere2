import { Navbar } from "@/components/navbar/Navbar";
import EditEventFormClient from "@/components/client/EditEventFormClient";
import { getEventById } from "@/actions/actions";
import { notFound } from "next/navigation";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  if (Number.isNaN(numericId)) notFound();

  let ev: any;
  try {
    ev = await getEventById(numericId);
  } catch (e: any) {
    if (
      typeof (e as any)?.message === "string" &&
      /404/.test((e as any).message)
    ) {
      notFound();
    }
    throw e;
  }
  const event = {
    eventId: ev?.eventId ?? -1,
    name: ev?.name ?? "Untitled Event",
    capacity: ev?.capacity ?? 0,
    userId: ev?.userId ?? "-",
    date: ev?.date ?? null, // 'YYYY-MM-DD' หรือ ISO string
    time: ev?.time ?? null, // 'HH:mm:ss'
    place: ev?.place ?? "-",
    detail: ev?.detail ?? "-",
    status: ev?.status ?? "publish",
    imageUrl:
      "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?q=80&w=1200&auto=format&fit=crop", // dummy ชั่วคราว
  };

  return (
    <div className="min-h-dvh w-full flex flex-col">
      <main className="flex-1 flex justify-center pt-2 pb-[calc(80px+env(safe-area-inset-bottom))]">
        <section className="relative w-[360px] max-w-full pt-12">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-0">
            <div className="min-w-65 rounded-full border border-black/60 bg-[var(--color-brand-primary)] px-12 py-3 text-center shadow-sm">
              <h1 className="translate-y-[-20%] text-[25px] font-bold tracking-wide">
                Edit Event {event.eventId}
              </h1>
            </div>
          </div>
          <EditEventFormClient event={event} />
        </section>
      </main>

      <div className="inset-x-0 bottom-0 z-[100]">
        <Navbar />
      </div>
    </div>
  );
}
