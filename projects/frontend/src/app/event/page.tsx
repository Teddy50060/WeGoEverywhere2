import Link from "next/link";
import { Navbar } from "@/components/navbar/Navbar";
import { getAllEvents } from "@/actions/actions";

type EventApi = {
  eventId: number;
  name: string;
};

export default async function EventPage() {
  let events: EventApi[] = [];

  try {
    events = (await getAllEvents()) as EventApi[];
  } catch (error: any) {
    console.error("โหลด event ไม่สำเร็จ:", error);
  }

  return (
    <>
      <div className="flex justify-center mt-4 font-black text-5xl">
        Event Page
      </div>

      <div className="flex justify-center mt-4 font-semibold text-2xl">
        Link to EventEditPage
      </div>

      <div className="flex flex-col items-center mt-4 text-lg font-medium">
        {events.length === 0 ? (
          <div className="text-gray-500">ยังไม่มีอีเวนต์</div>
        ) : (
          events.map((ev) => (
            <Link
              href={`/event/${ev.eventId}/edit`}
              key={ev.eventId}
              className="mb-2"
            >
              <div key={ev.eventId}>
                {ev.name} ({ev.eventId})
              </div>
            </Link>
          ))
        )}
      </div>

      <div className="flex justify-center mt-4 font-semibold text-2xl">
        <Link href="/event/create">Link to EventCreatePage</Link>
      </div>

      <Navbar />
    </>
  );
}
