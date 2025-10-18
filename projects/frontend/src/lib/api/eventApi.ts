import { apiCall } from '@/utils/api';

export interface Event {
  eventId: number;
  cost: string;
  name: string;
  date: string;
  time: string;
  place: string;
  capacity: number;
  detail: string;
  rating: number;
  status: string;
  userId: number;
  currentParticipants: number;
  title?: string;
  description?: string;
  location?: string;
  image?: string;
  categories?: string;
  coverUrl?: string;
  price?: string;
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

// Mock categories for events
const MOCK_CATEGORIES = [
  'Entertainment',
  'Education', 
  'Health',
  'Lifestyle',
  'Technology',
  'Environment'
];

// Random event images by category
const EVENT_IMAGES = {
  Entertainment: [
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=300&fit=crop',
  ],
  Education: [
    'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop',
  ],
  Health: [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68e71?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop',
  ],
  Lifestyle: [
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1529258283598-8d6fe60b27f4?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  ],
  Technology: [
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
  ],
  Environment: [
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop',
  ],
  General: [
    'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1537944434965-cf4679d1a598?w=400&h=300&fit=crop',
  ]
};

// Helper function to get random image for category
const getRandomImageForCategory = (category: string): string => {
  const categoryImages = EVENT_IMAGES[category as keyof typeof EVENT_IMAGES] || EVENT_IMAGES.General;
  const randomIndex = Math.floor(Math.random() * categoryImages.length);
  return categoryImages[randomIndex];
};

// Helper function to assign mock category based on event name/content
const getMockCategory = (event: Event): string => {
  const eventName = event.name.toLowerCase();
  const eventDetail = event.detail.toLowerCase();
  
  // Simple keyword-based category assignment
  if (eventName.includes('concert') || eventName.includes('music') || eventName.includes('party') || eventDetail.includes('entertainment')) {
    return 'Entertainment';
  } else if (eventName.includes('workshop') || eventName.includes('class') || eventName.includes('learn') || eventDetail.includes('education')) {
    return 'Education';
  } else if (eventName.includes('fitness') || eventName.includes('health') || eventName.includes('yoga') || eventDetail.includes('health')) {
    return 'Health';
  } else if (eventName.includes('tech') || eventName.includes('coding') || eventName.includes('programming') || eventDetail.includes('technology')) {
    return 'Technology';
  } else if (eventName.includes('nature') || eventName.includes('green') || eventName.includes('eco') || eventDetail.includes('environment')) {
    return 'Environment';
  } else if (eventName.includes('food') || eventName.includes('travel') || eventName.includes('lifestyle') || eventDetail.includes('lifestyle')) {
    return 'Lifestyle';
  } else {
    // Random assignment if no keywords match
    const randomIndex = Math.floor(Math.random() * MOCK_CATEGORIES.length);
    return MOCK_CATEGORIES[randomIndex];
  }
};

// Helper function to convert backend event to UI format
export const convertEventToUIFormat = (event: Event): Event => {
  const category = getMockCategory(event);
  
  return {
    ...event,
    title: event.name,
    price: event.cost,
    location: event.place || 'TBD',
    description: event.detail,
    categories: category,
    coverUrl: getRandomImageForCategory(category),
    // currentParticipants now comes directly from backend (joined table count)
    // No need to mock it anymore!
  };
};
