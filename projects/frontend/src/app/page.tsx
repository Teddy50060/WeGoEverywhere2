"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from "@/components/navbar/Navbar";
import { Search, Mic, MapPin, Users, Calendar } from "lucide-react";
import Image from "next/image";
import { userApi, type User } from "@/lib/api/userApi";
import { eventApi, convertEventToUIFormat, type Event } from "@/lib/api/eventApi";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);

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

  const fetchEvents = async () => {
    try {
      const eventsData = await eventApi.getAllEvents();
      const uiFormattedEvents = eventsData.map(convertEventToUIFormat);
      setEvents(uiFormattedEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setEvents([]);
    }
  };

  const fetchUserJoinedEvents = async () => {
    try {
      const joinedEventsData = await eventApi.getUserJoinedEvents();
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      const uiFormattedJoinedEvents = joinedEventsData
        .map(convertEventToUIFormat)
        .filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= currentDate;
        })
        .sort((a, b) => {
          const dateComparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          if (dateComparison !== 0) return dateComparison;
          return a.time.localeCompare(b.time);
        });
      setUpcomingEvents(uiFormattedJoinedEvents);
    } catch (error) {
      console.error('Failed to fetch user joined events:', error);
      setUpcomingEvents([]);
    }
  };

  const filterTags: string[] = ['Entertainment', 'Education', 'Health', 'Lifestyle', 'Technology', 'Environment'];

  const filteredEvents = events
    .filter(event => {
      const matchesSearch = (event.title || event.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (event.description || event.detail || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = !selectedFilter || event.categories === selectedFilter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      const dateComparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateComparison !== 0) return dateComparison;
      return a.time.localeCompare(b.time);
    });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getCategoriesColor = (categories: string) => {
    const colors: Record<string, string> = {
      'Entertainment': 'from-pink-300 to-pink-500',
      'Education': 'from-blue-300 to-blue-500',
      'Health': 'from-green-300 to-green-500',
      'Lifestyle': 'from-orange-300 to-orange-500',
      'Technology': 'from-cyan-300 to-cyan-500',
      'Environment': 'from-emerald-300 to-emerald-500',
      'General': 'from-gray-300 to-gray-500',
    };
    return colors[categories] || 'from-gray-300 to-gray-500';
  };

  useEffect(() => {
    fetchUser();
    fetchEvents();
    fetchUserJoinedEvents();
    const defaultHeader = document.getElementById('default-header');
    if (defaultHeader) {
      defaultHeader.style.display = 'none';
    }
    return () => {
      const defaultHeader = document.getElementById('default-header');
      if (defaultHeader) {
        defaultHeader.style.display = 'block';
      }
    };
  }, []);

  return (
  <div className="relative w-full max-w-[393px] mx-auto min-h-screen bg-white flex flex-col">
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
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-3 pb-2" style={{ width: 'max-content' }}>
              {upcomingEvents.map((event) => (
                <div key={event.eventId} className="flex-shrink-0 w-[110px]">
                  <div className={`relative w-full h-[90px] rounded-[18px] mb-2 overflow-hidden bg-gradient-to-br ${getCategoriesColor(event.categories || 'General')}`}>
                    <div className="absolute inset-0 bg-black bg-opacity-5"></div>
                    <img
                      src={event.coverUrl}
                      alt={event.title || event.name}
                      className="absolute inset-0 w-full h-full object-cover z-10"
                      onError={(e) => {
                        console.log('Image failed to load:', event.coverUrl);
                        e.currentTarget.style.display = 'none';
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', event.coverUrl);
                      }}
                    />
                  </div>
                  <div className="w-full bg-white rounded-[18px] p-2">
                    <div className="space-y-1">
                      <div className="font-inter font-medium text-[10px] leading-[12px] text-black">
                        {formatDate(event.date)}
                      </div>
                      <div className="font-inter font-normal text-[9px] leading-[11px] text-black line-clamp-2">
                        {event.title || event.name}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-2.5 h-2.5 text-gray-600" />
                        <span className="font-inter font-normal text-[8px] text-gray-700">
                          {event.currentParticipants || 0}/{event.capacity}
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
        <div className="w-full max-w-[350px] mb-6">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex space-x-2 pb-2" style={{ width: 'max-content' }}>
              {filterTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedFilter(selectedFilter === tag ? null : tag)}
                  className={`flex-shrink-0 px-4 py-2 rounded-[30px] transition-colors ${
                    selectedFilter === tag 
                      ? 'bg-[#EB6223] text-white' 
                      : 'bg-[#D4CDCD] text-black'
                  }`}
                >
                  <span className="font-inter font-normal text-[12px] leading-[22px] capitalize whitespace-nowrap">
                    {tag}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Event Grid */}
        <div className="w-full max-w-[350px] grid grid-cols-2 gap-4">
          {filteredEvents.map((event) => (
            <div key={event.eventId} className="bg-[#FFF3D2] rounded-[18px] overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
              <div className={`relative h-[80px] w-full bg-gradient-to-br ${getCategoriesColor(event.categories || 'General')}`}>
                <div className="absolute inset-0 bg-black bg-opacity-5"></div>
                <img
                  src={event.coverUrl}
                  alt={event.title || event.name}
                  className="absolute inset-0 w-full h-full object-cover z-10"
                  onError={(e) => {
                    console.log('Main grid image failed to load:', event.coverUrl);
                    e.currentTarget.style.display = 'none';
                  }}
                  onLoad={() => {
                    console.log('Main grid image loaded successfully:', event.coverUrl);
                  }}
                />
                <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full px-2 py-1 flex items-center justify-center z-20">
                  <span className="text-[8px] font-medium text-black">
                    {(event.price || event.cost || 0) === 0 ? 'Free' : `฿${event.price || event.cost}`}
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
                  <h3 className="font-inter font-medium text-[10px] leading-[12px] text-black line-clamp-2 min-h-[24px] max-h-[24px] overflow-hidden flex items-start">
                    {event.title || event.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-600" />
                    <span className="font-inter font-normal text-[8px] text-gray-700 truncate">
                      {event.location || event.place || 'TBD'}
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
        </div>
      </div>

      {/* Navbar at bottom with same positioning as other pages */}
      <footer className="mt-auto sticky bottom-0 w-full px-1 pb-[env(safe-area-inset-bottom)] z-50">
        <Navbar />
      </footer>
    </div>
  );
}
