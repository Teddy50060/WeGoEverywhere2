'use client';

import { useState, useEffect } from 'react';
import { Navbar } from "@/components/navbar/Navbar";
import { mockEvents, getUpcomingEvents, getEventsByCategory, type MockEvent, type EventCategory } from "@/lib/mockData";
import { Search, Mic, MapPin, Users, Calendar } from "lucide-react";
import Image from "next/image";
import { userApi, type User } from "@/lib/api/userApi";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<EventCategory | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<MockEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<MockEvent[]>([]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const userData = await userApi.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTags: EventCategory[] = ['technology', 'food', 'social'];

  // Filter events based on search and selected category
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !selectedFilter || event.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format time for display
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Get background color based on event category
  const getCategoryColor = (category: EventCategory) => {
    const colors = {
      sports: 'from-blue-300 to-blue-500',
      cultural: 'from-purple-300 to-purple-500',
      educational: 'from-green-300 to-green-500',
      social: 'from-pink-300 to-pink-500',
      outdoor: 'from-emerald-300 to-emerald-500',
      food: 'from-orange-300 to-orange-500',
      arts: 'from-indigo-300 to-indigo-500',
      technology: 'from-cyan-300 to-cyan-500'
    };
    return colors[category] || 'from-gray-300 to-gray-500';
  };

  useEffect(() => {
    fetchUser();
    
    // Load mock events
    setEvents(mockEvents);
    setUpcomingEvents(getUpcomingEvents()); // Get all upcoming events for scrolling
    
    // Hide the default header from layout.tsx when on home page
    const defaultHeader = document.getElementById('default-header');
    if (defaultHeader) {
      defaultHeader.style.display = 'none';
    }

    // Show the default header again when leaving this page
    return () => {
      const defaultHeader = document.getElementById('default-header');
      if (defaultHeader) {
        defaultHeader.style.display = 'block';
      }
    };
  }, []);

  return (
    <div className="relative w-full max-w-[393px] mx-auto min-h-screen bg-white">
      {/* Custom Header Banner for Home Page - Sticky */}
      <div className="sticky top-0 z-50 bg-brand-primary">
        <header className="bg-[var(--color-brand-secondary)] rounded-b-[50px] px-3 py-5 overflow-hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <h1 className="text-xl font-alt sm:text-2xl font-extrabold leading-none -translate-y-0.5 sm:-translate-y-1 ml-2 sm:ml-4">
              <span className="block text-[var(--color-brand-tertiary)]">
                WeGo
              </span>
              <span className="block text-[var(--color-brand-tertiary)]">
                EveryWhere
              </span>
            </h1>

            {/* Profile Picture */}
            <div className="relative h-[70px] w-[70px] rounded-full ring-3 ring-white shadow-lg overflow-hidden bg-white shrink-0">
              {loading ? (
                <div className="w-full h-full bg-gray-200 animate-pulse rounded-full" />
              ) : (
                <Image
                  src={user?.profilePicture || '/images/profile_image.png'}
                  alt="User Profile"
                  fill
                  sizes="70px"
                  className="object-cover"
                />
              )}
            </div>
          </div>
          
          {/* Good Morning below, centered */}
          <div className="flex justify-center mt-3">
            <div className="font-inter font-bold text-[15px] leading-[20px] text-black">
              Good Morning, "{loading ? 'first name' : user?.firstName || 'first name'}"
            </div>
          </div>
        </header>
      </div>

      {/* Main Content - Centered and Responsive */}
      <div className="flex flex-col items-center px-4 pt-4 pb-20">
        {/* Up Coming Event Section */}
        <div className="w-full max-w-[350px] bg-[#FFFBF0] border border-black rounded-[18px] p-4 mb-6">
          <h2 className="font-inter font-bold text-[17px] leading-[22px] text-black mb-4">
            Up Coming Event
          </h2>
          
          {/* Horizontal Scrollable Events */}
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-3 pb-2" style={{ width: 'max-content' }}>
              {getUpcomingEvents().map((event) => (
                <div key={event.id} className="flex-shrink-0 w-[90px]">
                                    <div className={`relative w-full h-[70px] rounded-[18px] mb-2 overflow-hidden bg-gradient-to-br ${getCategoryColor(event.category)}`}>
                    <Image
                      src={event.coverUrl}
                      alt={event.title}
                      fill
                      sizes="90px"
                      className="object-cover"
                      priority={false}
                      onError={(e) => {
                        // Hide image on error and show gradient background
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    
                    {/* Category badge */}
                    <div className="absolute top-1 left-1 bg-white bg-opacity-80 rounded-full px-1">
                      <span className="text-[6px] font-medium text-black capitalize">
                        {event.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-white rounded-[18px] p-2">
                    <div className="space-y-1">
                      <div className="font-inter font-medium text-[8px] leading-[10px] text-black">
                        {formatDate(event.date)}
                      </div>
                      <div className="font-inter font-normal text-[7px] leading-[9px] text-black line-clamp-2">
                        {event.title}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-2 h-2 text-gray-600" />
                        <span className="font-inter font-normal text-[6px] text-gray-700">
                          {event.currentParticipants}/{event.capacity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="w-full max-w-[350px] mb-6">
          <div className="flex items-center w-full h-[44px] bg-gray-200/40 rounded-full px-3">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-[17px] text-gray-600 placeholder-gray-400 focus:outline-none"
            />
            <Mic className="w-4 h-5 text-gray-400 ml-2" />
          </div>
        </div>

        {/* Filter Tags */}
        <div className="flex justify-center space-x-2 mb-6">
          {filterTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedFilter(selectedFilter === tag ? null : tag)}
              className={`px-4 py-2 rounded-[30px] transition-colors ${
                selectedFilter === tag 
                  ? 'bg-[#EB6223] text-white' 
                  : 'bg-[#D4CDCD] text-black'
              }`}
            >
              <span className="font-inter font-normal text-[12px] leading-[22px] capitalize">
                {tag}
              </span>
            </button>
          ))}
        </div>

        {/* Event Grid */}
        <div className="w-full max-w-[350px] grid grid-cols-2 gap-4">
          {filteredEvents.slice(0, 4).map((event) => (
            <div key={event.id} className="bg-[#FFF3D2] rounded-[18px] overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
              <div className={`relative h-[80px] w-full bg-gradient-to-br ${getCategoryColor(event.category)}`}>
                <Image
                  src={event.coverUrl}
                  alt={event.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    console.log('Main grid image failed to load:', event.coverUrl);
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                
                {/* Price tag */}
                <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full px-2 py-1">
                  <span className="text-[8px] font-medium text-black">
                    {event.price === 0 ? 'Free' : `฿${event.price}`}
                  </span>
                </div>
              </div>
              
              <div className="bg-[#D4DDFF] rounded-t-[18px] p-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-600" />
                    <span className="font-inter font-normal text-[8px] text-black">
                      {formatDate(event.date)} • {formatTime(event.time)}
                    </span>
                  </div>
                  
                  <h3 className="font-inter font-medium text-[10px] leading-[12px] text-black line-clamp-2">
                    {event.title}
                  </h3>
                  
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-600" />
                    <span className="font-inter font-normal text-[8px] text-gray-700 truncate">
                      {event.location}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-gray-600" />
                    <span className="font-inter font-normal text-[8px] text-gray-700">
                      {event.currentParticipants}/{event.capacity}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Fill empty slots if less than 4 events */}
          {Array.from({ length: Math.max(0, 4 - filteredEvents.length) }).map((_, index) => (
            <div key={`empty-main-${index}`} className="bg-[#FFF3D2] rounded-[18px] overflow-hidden opacity-50">
              <div className="h-[80px] w-full bg-gray-200"></div>
              <div className="bg-[#D4DDFF] rounded-t-[18px] p-3">
                <div className="font-inter font-normal text-[10px] leading-[14px] text-gray-400">
                  No events<br />available
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Navbar always at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50 max-w-[393px] mx-auto">
        <Navbar />
      </div>
    </div>
  );
}
