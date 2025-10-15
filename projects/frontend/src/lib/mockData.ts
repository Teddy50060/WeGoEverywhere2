// Mock data for WeGoEveryWhere application - Backend Schema Aligned

export const EVENT_CATEGORIES = [
  "Entertainment",
  "Education",
  "Health",
  "Lifestyle",
  "Technology",
  "Environment",
] as const;

export interface MockEvent {
  eventId: number;
  cost: number;
  name: string;
  date: string;
  time: string;
  place?: string;
  capacity: number;
  detail: string;
  rating: number;
  status: string;
  userId: number;
}

export interface MockUser {
  userId: number;
  firstName: string;
  lastName: string;
  telephoneNumber?: string;
  bio?: string;
  birthdate: string;
  sex?: string;
  signupTime?: string;
  signupDate?: string;
}

export const mockUsers: MockUser[] = [
  {
    userId: 1,
    firstName: "Sarah",
    lastName: "Johnson",
    telephoneNumber: "+66-123-456-789",
    bio: "Passionate yoga instructor and wellness advocate",
    birthdate: "1990-05-15",
    sex: "female",
    signupDate: "2024-01-15",
  },
  {
    userId: 2,
    firstName: "Alex",
    lastName: "Chen",
    telephoneNumber: "+66-987-654-321",
    bio: "Professional photographer capturing life's moments",
    birthdate: "1988-03-22",
    sex: "male",
    signupDate: "2024-02-10",
  },
];

export const mockEvents: MockEvent[] = [
  {
    eventId: 1,
    cost: 500.00,
    name: "Morning Yoga in Lumpini Park",
    date: "2025-10-16",
    time: "07:00",
    place: "Lumpini Park, Bangkok",
    capacity: 20,
    detail: "Start your day with energizing yoga practice in Bangkok's green heart. All levels welcome.",
    rating: 4.8,
    status: "active",
    userId: 1,
  },
  {
    eventId: 2,
    cost: 800.00,
    name: "Photography Walk: Old Bangkok",
    date: "2025-10-17",
    time: "09:30",
    place: "Rattanakosin Island, Bangkok",
    capacity: 15,
    detail: "Capture the essence of old Bangkok through your lens.",
    rating: 4.9,
    status: "active",
    userId: 2,
  },
  {
    eventId: 3,
    cost: 1200.00,
    name: "Thai Cooking Masterclass",
    date: "2025-10-18",
    time: "10:00",
    place: "Culinary Studio, Sukhumvit",
    capacity: 20,
    detail: "Learn authentic Thai cooking techniques from professional chefs. Includes market tour and full meal preparation.",
    rating: 4.8,
    status: "active",
    userId: 1,
  },
  {
    eventId: 4,
    cost: 0.00,
    name: "Tech Startup Networking",
    date: "2025-10-19",
    time: "18:30",
    place: "WeWork Ploenchit",
    capacity: 50,
    detail: "Connect with Bangkok's tech community. Guest speakers from leading startups and investment firms.",
    rating: 4.6,
    status: "active",
    userId: 2,
  },
  {
    eventId: 5,
    cost: 900.00,
    name: "Live Jazz Concert",
    date: "2025-10-20",
    time: "20:00",
    place: "Saxophone Pub, Victory Monument",
    capacity: 80,
    detail: "Experience Bangkok's premier jazz venue with local and international artists in an intimate setting.",
    rating: 4.9,
    status: "active",
    userId: 1,
  },
  {
    eventId: 6,
    cost: 2500.00,
    name: "Python Programming Bootcamp",
    date: "2025-10-21",
    time: "09:00",
    place: "Digital Innovation Hub",
    capacity: 25,
    detail: "Intensive weekend bootcamp covering Python fundamentals, web development, and data analysis for beginners.",
    rating: 4.8,
    status: "active",
    userId: 2,
  },
  {
    eventId: 7,
    cost: 1200.00,
    name: "Mindfulness Meditation Retreat",
    date: "2025-10-22",
    time: "08:00",
    place: "Serenity Garden, Chatuchak",
    capacity: 30,
    detail: "Full-day meditation retreat focusing on mindfulness, stress reduction, and mental well-being with healthy meals.",
    rating: 4.9,
    status: "active",
    userId: 1,
  },
  {
    eventId: 8,
    cost: 500.00,
    name: "Sustainable Living Workshop",
    date: "2025-10-23",
    time: "13:00",
    place: "Eco Living Center",
    capacity: 40,
    detail: "Learn practical ways to reduce your environmental footprint through zero-waste lifestyle and urban gardening.",
    rating: 4.7,
    status: "active",
    userId: 2,
  },
  {
    eventId: 9,
    cost: 1500.00,
    name: "Wine & Cheese Tasting Evening",
    date: "2025-10-24",
    time: "19:00",
    place: "The Wine Loft, Silom",
    capacity: 25,
    detail: "Sophisticated evening of wine and cheese pairing with selections from France, Italy, and local artisanal cheeses.",
    rating: 4.8,
    status: "active",
    userId: 1,
  },
  {
    eventId: 10,
    cost: 1800.00,
    name: "AI & Machine Learning Seminar",
    date: "2025-10-25",
    time: "14:00",
    place: "Bangkok University Tech Campus",
    capacity: 60,
    detail: "Comprehensive seminar on AI and ML applications in business with hands-on workshops and industry experts.",
    rating: 4.9,
    status: "active",
    userId: 2,
  },
  {
    eventId: 11,
    cost: 650.00,
    name: "Comedy Night Stand-up Show",
    date: "2025-10-26",
    time: "21:00",
    place: "Comedy Club Bangkok",
    capacity: 100,
    detail: "Hilarious night of stand-up comedy featuring local and international comedians with drinks and snacks.",
    rating: 4.7,
    status: "active",
    userId: 1,
  },
  {
    eventId: 12,
    cost: 3200.00,
    name: "Digital Marketing Masterclass",
    date: "2025-10-27",
    time: "09:00",
    place: "Marketing Institute Bangkok",
    capacity: 35,
    detail: "Advanced digital marketing strategies covering SEO, social media, content marketing, and analytics.",
    rating: 4.8,
    status: "active",
    userId: 2,
  },
];

const getCategoryForEvent = (eventId: number): string => {
  const categoryMap: Record<number, string> = {
    1: "Health",        // Morning Yoga
    2: "Lifestyle",     // Photography Walk
    3: "Lifestyle",     // Thai Cooking
    4: "Technology",    // Tech Startup Networking
    5: "Entertainment", // Live Jazz Concert
    6: "Education",     // Python Programming Bootcamp
    7: "Health",        // Mindfulness Meditation
    8: "Environment",   // Sustainable Living Workshop
    9: "Lifestyle",     // Wine & Cheese Tasting
    10: "Technology",   // AI & Machine Learning Seminar
    11: "Entertainment", // Comedy Night Stand-up Show
    12: "Education",    // Digital Marketing Masterclass
  };
  return categoryMap[eventId] || "General";
};

const getEventImageUrl = (eventId: number): string => {
  // Use related, high-quality images for each event type
  const imageMap: Record<number, string> = {
    1: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop&crop=center", // Morning Yoga - peaceful yoga pose
    2: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=500&h=300&fit=crop&crop=center", // Photography Walk - old architecture
    3: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=300&fit=crop&crop=center", // Thai Cooking - cooking ingredients
    4: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=500&h=300&fit=crop&crop=center", // Tech Networking - conference room
    5: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop&crop=center", // Jazz Concert - live music
    6: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&h=300&fit=crop&crop=center", // Programming Bootcamp - coding screen
    7: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=300&fit=crop&crop=center", // Meditation Retreat - meditation stones
    8: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&h=300&fit=crop&crop=center", // Sustainable Living - plants/eco
    9: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500&h=300&fit=crop&crop=center", // Wine & Cheese - wine glasses
    10: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=300&fit=crop&crop=center", // AI & ML Seminar - technology/AI
    11: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&h=300&fit=crop&crop=center", // Comedy Night - microphone/stage
    12: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop&crop=center", // Digital Marketing - laptop/analytics
  };
  return imageMap[eventId] || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&h=300&fit=crop&crop=center";
};

// Mock user registrations - events that the current user has registered for
const mockUserRegistrations = [1, 3, 7, 9, 11]; // User is registered for these event IDs

export const getUserRegisteredEvents = (): any[] => {
  return mockEvents
    .filter(event => mockUserRegistrations.includes(event.eventId))
    .map(event => ({
      id: event.eventId.toString(),
      title: event.name,
      description: event.detail,
      category: getCategoryForEvent(event.eventId),
      status: "upcoming",
      coverUrl: getEventImageUrl(event.eventId),
      organizer: {
        id: event.userId.toString(),
        name: "Event Organizer",
        rating: event.rating,
      },
      date: event.date,
      time: event.time,
      location: event.place || "TBD",
      address: event.place || "TBD",
      capacity: event.capacity,
      currentParticipants: Math.floor(Math.random() * (event.capacity * 0.8)), // Random participants
      participants: [],
      price: event.cost,
      currency: "THB",
      requirements: [],
      whatToBring: [],
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isRegistered: true, // Mark as registered
    }));
};

export const getUIEvents = (): any[] => {
  return mockEvents.map(event => ({
    id: event.eventId.toString(),
    title: event.name,
    description: event.detail,
    category: getCategoryForEvent(event.eventId),
    status: "upcoming",
    coverUrl: getEventImageUrl(event.eventId),
    organizer: {
      id: event.userId.toString(),
      name: "Event Organizer",
      rating: event.rating,
    },
    date: event.date,
    time: event.time,
    location: event.place || "TBD",
    address: event.place || "TBD",
    capacity: event.capacity,
    currentParticipants: Math.floor(Math.random() * (event.capacity * 0.8)),
    participants: [],
    price: event.cost,
    currency: "THB",
    requirements: [],
    whatToBring: [],
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isRegistered: mockUserRegistrations.includes(event.eventId),
  }));
};

export const getEventById = (eventId: number) => {
  return mockEvents.find(event => event.eventId === eventId);
};

export const convertToUIEvent = (event: MockEvent) => {
  return {
    id: event.eventId.toString(),
    title: event.name,
    description: event.detail,
    category: getCategoryForEvent(event.eventId),
    status: "upcoming",
    coverUrl: getEventImageUrl(event.eventId),
    organizer: {
      id: event.userId.toString(),
      name: "Event Organizer",
      rating: event.rating,
    },
    date: event.date,
    time: event.time,
    location: event.place || "TBD",
    address: event.place || "TBD",
    capacity: event.capacity,
    currentParticipants: 0,
    participants: [],
    price: event.cost,
    currency: "THB",
    requirements: [],
    whatToBring: [],
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};
