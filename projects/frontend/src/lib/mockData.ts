// Mock data for WeGoEveryWhere application

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type EventCategory = 'sports' | 'cultural' | 'educational' | 'social' | 'outdoor' | 'food' | 'arts' | 'technology';
export type ParticipationStatus = 'registered' | 'completed' | 'cancelled' | 'no-show';

export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  status: ParticipationStatus;
  joinedAt: string;
  completedAt?: string;
  rating?: number;
  feedback?: string;
}

export interface Organizer {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  eventsOrganized: number;
  rating: number;
}

export interface MockEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  status: EventStatus;
  coverUrl: string;
  organizer: Organizer;
  date: string;
  time: string;
  location: string;
  address: string;
  capacity: number;
  currentParticipants: number;
  participants: Participant[];
  price: number;
  currency: string;
  requirements?: string[];
  whatToBring?: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserActivity {
  eventId: string;
  status: ParticipationStatus;
  rating?: number;
  feedback?: string;
  completedAt?: string;
  photos?: string[];
}

// Mock organizers
export const mockOrganizers: Organizer[] = [
  {
    id: 'org-1',
    name: "Yoga's Garden",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    bio: "Certified yoga instructor with 10+ years of experience",
    eventsOrganized: 45,
    rating: 4.8
  },
  {
    id: 'org-2',
    name: "Bangkok Photo Club",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    bio: "Community of photography enthusiasts",
    eventsOrganized: 32,
    rating: 4.6
  },
  {
    id: 'org-3',
    name: "Foodie Adventures",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
    bio: "Exploring Bangkok's culinary scene together",
    eventsOrganized: 28,
    rating: 4.9
  },
  {
    id: 'org-4',
    name: "Bangkok Tech Community",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    bio: "Connecting tech professionals in Bangkok",
    eventsOrganized: 67,
    rating: 4.7
  },
  {
    id: 'org-5',
    name: "Bangkok Runners",
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?q=80&w=200&auto=format&fit=crop",
    bio: "Running community for all fitness levels",
    eventsOrganized: 89,
    rating: 4.8
  },
  {
    id: 'org-6',
    name: "Creative Workshop BKK",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop",
    bio: "Arts and crafts workshops for everyone",
    eventsOrganized: 34,
    rating: 4.9
  }
];

// Mock events
export const mockEvents: MockEvent[] = [
  {
    id: "1",
    title: "Morning Yoga in Lumpini Park",
    description: "Join us for a refreshing morning yoga session in the heart of Bangkok. Perfect for all skill levels, this outdoor yoga class will help you start your day with mindfulness and energy. Our certified instructor will guide you through gentle flows and breathing exercises while surrounded by nature.",
    category: "sports",
    status: "upcoming",
    coverUrl: "/images/logo.png",
    organizer: mockOrganizers[0],
    date: "2025-10-15",
    time: "07:00",
    location: "Lumpini Park",
    address: "Pathum Wan, Bangkok 10330",
    capacity: 20,
    currentParticipants: 15,
    participants: [
      {
        id: "p-1",
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=200&auto=format&fit=crop",
        status: "registered",
        joinedAt: "2025-10-10T14:30:00Z"
      },
      {
        id: "p-2",
        name: "Mike Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
        status: "registered",
        joinedAt: "2025-10-11T09:15:00Z"
      }
    ],
    price: 300,
    currency: "THB",
    requirements: ["Yoga mat", "Comfortable clothing"],
    whatToBring: ["Water bottle", "Towel"],
    tags: ["yoga", "morning", "outdoor", "beginner-friendly"],
    createdAt: "2025-10-08T10:00:00Z",
    updatedAt: "2025-10-11T16:45:00Z"
  },
  {
    id: "2",
    title: "Street Photography Workshop",
    description: "Discover the art of street photography in Bangkok's vibrant neighborhoods. Learn composition techniques, lighting tips, and how to capture authentic moments. We'll explore Chinatown and practice different photography styles while building your portfolio.",
    category: "arts",
    status: "upcoming",
    coverUrl: "/images/circlelogo.png",
    organizer: mockOrganizers[1],
    date: "2025-10-16",
    time: "14:00",
    location: "Chinatown",
    address: "Yaowarat Road, Samphanthawong, Bangkok",
    capacity: 12,
    currentParticipants: 8,
    participants: [
      {
        id: "p-3",
        name: "Alex Rivera",
        status: "registered",
        joinedAt: "2025-10-09T11:20:00Z"
      }
    ],
    price: 800,
    currency: "THB",
    requirements: ["DSLR or mirrorless camera", "Basic photography knowledge"],
    whatToBring: ["Camera", "Extra batteries", "Comfortable walking shoes"],
    tags: ["photography", "workshop", "chinatown", "intermediate"],
    createdAt: "2025-10-05T13:30:00Z",
    updatedAt: "2025-10-11T18:20:00Z"
  },
  {
    id: "3",
    title: "Thai Cooking Class & Market Tour",
    description: "Experience authentic Thai cuisine by joining our cooking class that starts with a guided market tour. Learn to prepare traditional dishes like Pad Thai, Tom Yum, and Mango Sticky Rice from experienced local chefs. All ingredients and recipes included!",
    category: "food",
    status: "upcoming",
    coverUrl: "/images/profile_image.png",
    organizer: mockOrganizers[2],
    date: "2025-10-17",
    time: "10:00",
    location: "Cooking Studio & Local Market",
    address: "Sukhumvit Soi 39, Bangkok",
    capacity: 16,
    currentParticipants: 14,
    participants: [
      {
        id: "p-4",
        name: "Emma Thompson",
        status: "registered",
        joinedAt: "2025-10-05T16:45:00Z"
      }
    ],
    price: 1200,
    currency: "THB",
    requirements: ["None - all levels welcome"],
    whatToBring: ["Apron provided", "Notebook for recipes"],
    tags: ["cooking", "thai-food", "market-tour", "cultural"],
    createdAt: "2025-09-30T09:15:00Z",
    updatedAt: "2025-10-08T16:00:00Z"
  },
  {
    id: "4",
    title: "Tech Networking Night",
    description: "Connect with fellow tech professionals, entrepreneurs, and innovators in Bangkok's thriving tech scene. Featuring guest speakers from leading startups and established companies, plus structured networking activities and refreshments.",
    category: "technology",
    status: "upcoming",
    coverUrl: "/images/circlelogoinvert.png",
    organizer: mockOrganizers[3],
    date: "2025-10-18",
    time: "18:30",
    location: "WeWork Ploenchit",
    address: "Ploenchit Rd, Pathum Wan, Bangkok 10330",
    capacity: 50,
    currentParticipants: 32,
    participants: [],
    price: 0,
    currency: "THB",
    requirements: ["None"],
    whatToBring: ["Business cards", "Laptop (optional)"],
    tags: ["networking", "technology", "startup", "professional"],
    createdAt: "2025-10-01T10:00:00Z",
    updatedAt: "2025-10-12T14:30:00Z"
  },
  {
    id: "5",
    title: "Weekend Coffee Tasting",
    description: "Explore the world of specialty coffee with our expert barista. Learn about coffee origins, brewing methods, and taste profiles. Sample 6 different single-origin coffees and discover your perfect cup!",
    category: "food",
    status: "upcoming",
    coverUrl: "/images/next.svg",
    organizer: {
      id: 'org-coffee',
      name: "Bean There Coffee",
      avatar: "https://images.unsplash.com/photo-1511485977113-f34c92461ad9?q=80&w=200&auto=format&fit=crop",
      bio: "Specialty coffee roasters and educators",
      eventsOrganized: 23,
      rating: 4.8
    },
    date: "2025-10-19",
    time: "15:00",
    location: "Bean There Coffee Shop",
    address: "Thonglor Soi 10, Bangkok",
    capacity: 15,
    currentParticipants: 11,
    participants: [],
    price: 650,
    currency: "THB",
    requirements: ["None"],
    whatToBring: ["Appetite for coffee!"],
    tags: ["coffee", "tasting", "weekend", "specialty"],
    createdAt: "2025-10-02T11:00:00Z",
    updatedAt: "2025-10-13T09:30:00Z"
  },
  {
    id: "6",
    title: "Sunset Party at Rooftop Bar",
    description: "Join us for an unforgettable sunset party with panoramic views of Bangkok skyline. Live DJ, signature cocktails, and great vibes. Perfect for meeting new people and celebrating the weekend!",
    category: "social",
    status: "upcoming",
    coverUrl: "/images/logo.png",
    organizer: {
      id: 'org-party',
      name: "Bangkok Social Club",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop",
      bio: "Creating memorable social experiences",
      eventsOrganized: 156,
      rating: 4.7
    },
    date: "2025-10-20",
    time: "17:00",
    location: "Sky Bar Bangkok",
    address: "Silom Rd, Bang Rak, Bangkok",
    capacity: 100,
    currentParticipants: 67,
    participants: [],
    price: 500,
    currency: "THB",
    requirements: ["Age 21+", "Smart casual dress code"],
    whatToBring: ["ID", "Good vibes"],
    tags: ["party", "sunset", "rooftop", "cocktails", "social"],
    createdAt: "2025-09-28T16:00:00Z",
    updatedAt: "2025-10-14T11:15:00Z"
  }
];

// Mock user activities for tracking participation
export const mockUserActivities: UserActivity[] = [
  {
    eventId: "1",
    status: "registered"
  },
  {
    eventId: "3",
    status: "completed",
    rating: 5,
    feedback: "Amazing cooking class! Learned so much about Thai cuisine.",
    completedAt: "2025-10-08T15:30:00Z",
    photos: ["photo1.jpg", "photo2.jpg"]
  }
];

// Utility functions
export const getEventById = (id: string): MockEvent | undefined => {
  return mockEvents.find(event => event.id === id);
};

export const getEventsByCategory = (category: EventCategory): MockEvent[] => {
  return mockEvents.filter(event => event.category === category);
};

export const getEventsByStatus = (status: EventStatus): MockEvent[] => {
  return mockEvents.filter(event => event.status === status);
};

export const getUserActivityForEvent = (eventId: string): UserActivity | undefined => {
  return mockUserActivities.find(activity => activity.eventId === eventId);
};

export const isUserRegisteredForEvent = (eventId: string): boolean => {
  const activity = getUserActivityForEvent(eventId);
  return activity?.status === 'registered' || activity?.status === 'completed';
};

export const getUpcomingEvents = (): MockEvent[] => {
  return mockEvents.filter(event => event.status === 'upcoming');
};

export const getRecommendedEvents = (): MockEvent[] => {
  // Simple recommendation based on high ratings and availability
  return mockEvents
    .filter(event => event.status === 'upcoming')
    .filter(event => event.organizer.rating >= 4.7)
    .slice(0, 3);
};