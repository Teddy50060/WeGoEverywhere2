"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from "next/image";
import { CalendarDays, MapPin } from "lucide-react";
import { eventApi, convertEventToUIFormat, type Event } from "@/lib/api/eventApi";
import { userApi, type User } from "@/lib/api/userApi";
import { Navbar } from "@/components/navbar/Navbar";
import toast from 'react-hot-toast';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [organizer, setOrganizer] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [isEventPast, setIsEventPast] = useState(false);

  useEffect(() => {
    const fetchEventAndOrganizer = async () => {
      try {
        setLoading(true);
        const eventData = await eventApi.getEventById(parseInt(eventId));
        const formattedEvent = convertEventToUIFormat(eventData);
        setEvent(formattedEvent);

        // Check if event has passed
        const now = new Date();
        const eventDate = new Date(formattedEvent.date);
        const [hours, minutes] = formattedEvent.time.split(':').map(Number);
        eventDate.setHours(hours, minutes, 0, 0);
        setIsEventPast(eventDate < now);

        // Try to get organizer information
        if (eventData.userId) {
          try {
            // First try to get current user to see if this is their event
            const currentUser = await userApi.getCurrentUser();
            if (currentUser.userId === eventData.userId) {
              // This is the current user's event
              setOrganizer(currentUser);
            } else {
              // Try to get organizer by ID (this might fail if endpoint doesn't exist)
              try {
                const organizerData = await userApi.getUserById(eventData.userId);
                setOrganizer(organizerData);
              } catch (orgErr) {
                console.error('Failed to fetch organizer by ID:', orgErr);
                // Set fallback organizer name
                setOrganizer({
                  userId: eventData.userId,
                  firstName: 'Unknown',
                  lastName: 'Organizer',
                  birthdate: '',
                } as User);
              }
            }

            // Check if user already joined this event
            const joinedEvents = await eventApi.getUserJoinedEvents();
            const joined = joinedEvents.some(e => e.eventId === eventData.eventId);
            setHasJoined(joined);
          } catch (userErr) {
            console.error('Failed to fetch current user:', userErr);
            // Set fallback organizer name
            setOrganizer({
              userId: eventData.userId || 0,
              firstName: 'Unknown',
              lastName: 'Organizer',
              birthdate: '',
            } as User);
          }
        }
      } catch (err) {
        console.error('Failed to fetch event:', err);
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventAndOrganizer();
    }
  }, [eventId]);

  // Format date for display (MM/DD/YYYY format)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: '2-digit',
      day: '2-digit', 
      year: 'numeric'
    });
  };

  const handleRegisterToggle = async () => {
    if (!event) return;
    // Prevent registration/unregistration if event has passed
    if (isEventPast) {
      toast.error('This event has already ended.', { duration: 3000 });
      return;
    }
    // Prevent registration if event is full
    if (!hasJoined && event.currentParticipants >= event.capacity) {
      toast.error('Event is full.', { duration: 3000 });
      return;
    }
    const loadingToast = toast.loading('Processing...');
    try {
      if (hasJoined) {
        await eventApi.unjoinEvent(event.eventId);
        setHasJoined(false);
        toast.success('Event unregistration successful!', { id: loadingToast, duration: 3000 });
      } else {
        await eventApi.joinEvent(event.eventId);
        setHasJoined(true);
        toast.success('Event registration successful!', { id: loadingToast, duration: 3000 });
      }
      // Refresh event data to update participant count
      const updatedEvent = await eventApi.getEventById(event.eventId);
      setEvent(convertEventToUIFormat(updatedEvent));
    } catch (err) {
      console.error('Registration error:', err);
      toast.error(
        hasJoined
          ? 'Failed to unregister from event.'
          : 'Failed to register for event.',
        { id: loadingToast, duration: 3000 }
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Event not found'}</p>
          <button 
            onClick={() => router.push('/')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[393px] mx-auto min-h-screen bg-white p-4">
      {/* Back Button */}
      <div className="mb-2 flex items-center gap-2">
        <button
          onClick={() => router.push("/")}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-[#E8C5C5] hover:bg-orange-300 text-black border border-black"
          aria-label="Back to Home"
        >
          {/* Left arrow icon (SVG) */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-gray-600 text-sm">Events/Event Detail</span>
      </div>

      {/* Main Card with Black Border */}
      <div className="border-2 border-black rounded-3xl bg-[#FDF8F0] p-6 mb-20">
        {/* Event Title and Joined Count */}
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-[#E8C5C5] rounded-full px-6 py-3 flex-1 min-w-0">
            <h2 className="font-bold text-black text-lg leading-tight max-w-[200px] break-words line-clamp-2 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {event.title || event.name}
            </h2>
          </div>
          <div className="bg-white rounded-full px-4 py-2 border border-black whitespace-nowrap flex-shrink-0">
            <span className="text-sm font-medium text-gray-700">
              {event.currentParticipants} / {event.capacity}
            </span>
          </div>
        </div>

        {/* Event Image */}
        <div className="relative mb-6">
          <div className="relative h-[200px] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-yellow-200 to-orange-300">
            {event.coverUrl && (
              <Image
                src={event.coverUrl}
                alt={event.title || event.name || 'Event'}
                fill
                className="object-cover"
                priority
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
          </div>
        </div>

        {/* Category Tag */}
        {event.categories && event.categories.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {event.categories.map((cat: string, idx: number) => (
              <span
                key={idx}
                className="bg-[#E8C5C5] rounded-full px-4 py-2 text-sm font-medium text-black border border-black"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Organizer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organizer
            </label>
            <input
              type="text"
              readOnly
              value={organizer ? `${organizer.firstName} ${organizer.lastName}` : 'Loading...'}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700"
            />
          </div>

          {/* Event Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Date
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={formatDate(event.date)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700"
              />
              <CalendarDays className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={event.location || event.place || 'To Be Determined'}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700"
              />
              <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Details
            </label>
            <textarea
              readOnly
              rows={4}
              value={event.description || event.detail || 'No additional details provided.'}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons - Outside the frame */}
      <div className="-mt-10 space-y-3 mb-20">
        {/* Registration Button Logic */}
        {(!hasJoined && event.currentParticipants >= event.capacity) ? (
          <button
            disabled
            className="w-full font-bold py-3 px-6 rounded-full border border-black bg-gray-300 text-gray-500 cursor-not-allowed shadow-sm"
          >
            This event is full.
          </button>
        ) : (
          <button
            onClick={handleRegisterToggle}
            disabled={isEventPast}
            className={`w-full font-bold py-3 px-6 rounded-full border border-black transition-colors shadow-sm ${
              isEventPast
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : hasJoined
                ? 'bg-red-200 text-red-700 hover:bg-red-300'
                : 'bg-[#9BE28C] hover:bg-green-400 text-green-900'
            }`}
          >
            {isEventPast 
              ? "Event Ended" 
              : hasJoined 
              ? "Cancel Registration" 
              : "Register for Event"}
          </button>
        )}
        <button
          onClick={() => toast.success('Report submitted successfully!', { 
            duration: 3000 
          })}
          className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 px-6 transition-colors text-sm text-center underline"
        >
          Report This Event
        </button>
      </div>

      {/* Sticky bottom Navbar, consistent across all pages */}
      <footer className="sticky bottom-0 w-full z-50 bg-transparent max-w-[393px] mx-auto">
        <Navbar />
      </footer>
    </div>
  );
}