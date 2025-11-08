"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Navbar } from "@/components/navbar/Navbar";
import { getAllEvents } from "@/actions/actions";
import { UserService } from "@/lib/api";
import toast from "react-hot-toast";

type EventApi = {
  eventId: number;
  name: string;
  status: string;
  date: string;
  time?: string;
  imageUrl?: string;
  creatorId?: number;
};

export default function EventPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"created" | "attending" | "history">("created");
  const [events, setEvents] = useState<EventApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const userData = await UserService.userControllerGetUser();
      setUser(userData);

      const eventsData = (await getAllEvents()) as EventApi[];
      setEvents(eventsData);
    } catch (error: any) {
      console.error("Failed to load data:", error);
      toast.error("Cannot load data");
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events.filter((event) => {
      const eventDate = new Date(event.date);
      
      if (activeTab === "history") {
        return eventDate < today;
      } else {
        return eventDate >= today;
      }
    }).filter((event) => {
      if (activeTab === "created") {
        // TODO: Filter by user's created events
        return true;
      } else if (activeTab === "attending") {
        // TODO: Filter by user's joined events
        return true;
      }
      return true;
    });
  };

  const handleEventClick = (eventId: number) => {
    if (activeTab === "created") {
      router.push(`/event/${eventId}/edit`);
    } else {
      router.push(`/event/${eventId}`);
    }
  };

  const filteredEvents = filterEvents();

  return (
    <div className="relative w-full max-w-[393px] mx-auto min-h-screen bg-[#FFF8F0] flex flex-col">
      {/* Main Content */}
      <main className="flex-1 px-6 pt-4 pb-24 font-alt">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("created")}
            className={`flex-1 h-12 rounded-full text-base font-semibold transition-colors ${
              activeTab === "created"
                ? "bg-[#FFD5C7] text-black"
                : "bg-white text-gray-600"
            }`}
          >
            Created
          </button>
          <button
            onClick={() => setActiveTab("attending")}
            className={`flex-1 h-12 rounded-full text-base font-semibold transition-colors ${
              activeTab === "attending"
                ? "bg-[#FFD5C7] text-black"
                : "bg-white text-gray-600"
            }`}
          >
            Attending
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 h-12 rounded-full text-base font-semibold transition-colors ${
              activeTab === "history"
                ? "bg-[#FFD5C7] text-black"
                : "bg-white text-gray-600"
            }`}
          >
            History
          </button>
        </div>

        {/* Event Cards */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <p className="text-gray-500">Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-center">
              <div className="mb-4">
                <svg
                  className="mx-auto w-20 h-20 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-base font-semibold text-gray-700 mb-1">
                No events yet
              </p>
              <p className="text-sm text-gray-500">
                {activeTab === "created"
                  ? "Create your first event!"
                  : activeTab === "attending"
                  ? "Join an event to see it here"
                  : "No past events"}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredEvents.map((event) => (
              <div
                key={event.eventId}
                onClick={() => handleEventClick(event.eventId)}
                className="cursor-pointer hover:scale-[1.02] transition-transform"
              >
                {/* Event Card */}
                <div className="rounded-[20px] overflow-hidden shadow-md bg-white">
                  {/* Image */}
                  <div className="w-full h-32 bg-[#FFFACD] relative">
                    {event.imageUrl && (
                      <Image
                        src={event.imageUrl}
                        alt={event.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3 bg-[#E6E6FA]">
                    {/* Status Badge */}
                    {activeTab === "created" && (
                      <div className="mb-2">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            event.status === "published"
                              ? "bg-[#C5E99B] text-black"
                              : "bg-[#FFB3B3] text-black"
                          }`}
                        >
                          {event.status === "published" ? "publish" : "Unpublish"}
                        </span>
                      </div>
                    )}

                    {/* Date */}
                    <p className="text-sm text-gray-700 mb-1">
                      Date: {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>

                    {/* Event Name */}
                    <p className="text-base font-semibold text-gray-900 truncate">
                      Event name: {event.name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Navbar */}
      <footer className="sticky bottom-0 w-full px-1 pb-[env(safe-area-inset-bottom)] z-50">
        <Navbar />
      </footer>
    </div>
  );
}