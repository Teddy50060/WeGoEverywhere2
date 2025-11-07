import { apiCall } from '@/utils/api';

export interface Event {
  eventId: number;
  cost: string | number;
  name: string;
  date: string;
  time: string;
  place: string;
  capacity: number;
  detail: string;
  rating: number;
  status: string;
  userId: number;
  currentParticipants: number; // Now comes from backend joined table count
  // Additional fields for UI compatibility
  title?: string; // Will map from name
  price?: number | string; // Will map from cost
  location?: string; // Will map from place
  description?: string; // Will map from detail
  categories?: string[]; // Use backend categories
  coverUrl?: string; // Default placeholder
  imagePath?: string; // Path from backend for event image
// ...existing code...
}

export interface CreateEventDto {
  name: string;
  cost?: number;
  date: string;
  time: string;
  place?: string;
  capacity: number;
  detail: string;
  userId: number;
}

export interface UpdateEventDto {
  name?: string;
  cost?: number;
  date?: string;
  time?: string;
  place?: string;
  capacity?: number;
  detail?: string;
  rating?: number;
  status?: string;
}

export const eventApi = {
  // Unjoin an event
  unjoinEvent: async (eventId: number): Promise<void> => {
    return apiCall(`/events/${eventId}/join`, { method: 'DELETE' });
  },
  // Join an event (register)
  joinEvent: async (eventId: number): Promise<void> => {
    return apiCall(`/events/${eventId}/join`, { method: 'POST' });
  },
  // Get all events
  getAllEvents: async (): Promise<Event[]> => {
    return apiCall('/events');
  },
  
  // Get event by ID
  getEventById: async (id: number): Promise<Event> => {
    return apiCall(`/events/${id}`);
  },
  
  // Create new event
  createEvent: async (data: CreateEventDto): Promise<Event> => {
    return apiCall('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  // Update event
  updateEvent: async (id: number, data: UpdateEventDto): Promise<Event> => {
    return apiCall(`/events/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  
  // Delete event
  deleteEvent: async (id: number): Promise<void> => {
    return apiCall(`/events/${id}`, {
      method: 'DELETE',
    });
  },

  // Get events that the current user has joined
  getUserJoinedEvents: async (): Promise<Event[]> => {
    return apiCall('/events/user/joined');
  },
};

// Helper function to convert backend event to UI format
export const convertEventToUIFormat = (event: Event): Event => {
  // Prepend API base URL if imagePath exists and is not already absolute
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  let coverUrl = '/images/event_default.png';
  if (event.imagePath) {
    coverUrl = event.imagePath.startsWith('http')
      ? event.imagePath
      : `${baseUrl}${event.imagePath}`;
  }
  return {
    ...event,
    title: event.name,
    price: event.cost,
    location: event.place || 'TBD',
    description: event.detail,
    categories: event.categories,
    coverUrl,
    // currentParticipants now comes directly from backend (joined table count)
  };
};
