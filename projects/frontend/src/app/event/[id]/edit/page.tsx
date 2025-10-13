import { Navbar } from "@/components/navbar/Navbar";
import EditEventFormClient from "@/components/client/EditEventFormClient";
import { getEventById } from "@/actions/actions"; // ดึงจาก action.ts

type EditEventPageProps = {
  params: { id: string };
};

export default async function EditEventPage({ params }: EditEventPageProps) {
  const id = params.id; // ดึงจาก dynamic route [id]
  //const eventData = await getEventById(Number(id));
  const eventData = {
    // ตัวอย่าง payload ที่ backend ควรส่ง
    id: id,
    photoUrl:
      "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?q=80&w=1200&auto=format&fit=crop",
    name: "YoGa's Garden",
    date: "2025-11-12T00:00:00.000Z",
    place: "Lumpini Park",
    detail:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Recusandae at tenetur sed odio eaque culpa rerum laboriosam beatae voluptate sint doloribus nisi tempore nihil ipsa mollitia pariatur expedita, quisquam consequuntur debitis hic optio voluptates? Facere, commodi porro ad consequatur eum tenetur nostrum voluptas doloribus omnis rem tempora assumenda itaque, aliquid quas!",
    capacity: 150,
    status: "publish",
  };

  const existing = {
    photoUrl: eventData.photoUrl ?? "",
    name: eventData.name ?? "",
    dateString: eventData.date
      ? new Date(eventData.date).toISOString().slice(0, 10)
      : "",
    location: eventData.place ?? "",
    details: eventData.detail ?? "",
    capacity: eventData.capacity ?? 0,
    status: (eventData.status ?? "unpublish") as "publish" | "unpublish",
  };

  return (
    <div className="min-h-dvh w-full flex flex-col">
      <main className="flex-1 flex justify-center pt-2 pb-[calc(80px+env(safe-area-inset-bottom))]">
        <section className="relative w-[360px] max-w-full pt-12">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-0">
            <div className="min-w-65 rounded-full border border-black/60 bg-[var(--color-brand-primary)] px-12 py-3 text-center shadow-sm">
              <h1 className="translate-y-[-20%] text-[26px] font-bold tracking-wide">
                Edit Event
              </h1>
            </div>
          </div>
          <EditEventFormClient id={id} existing={existing} />
        </section>
      </main>

      <div className="inset-x-0 bottom-0 z-[100]">
        <Navbar />
      </div>
    </div>
  );
}
