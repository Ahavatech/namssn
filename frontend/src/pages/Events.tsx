import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import { eventsAPI } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock } from 'lucide-react';

// Simple internal Carousel component
function Carousel({ images }: { images: any[] }) {
  const [idx, setIdx] = useState(0);
  const current = images[idx];

  if (!current) return <p className="text-center text-gray-500">No images available</p>;

  return (
    <div className="flex flex-col items-center">
      <img
        src={current.url || current.imageUrl || ''}
        alt={current.title || 'Event Image'}
        className="w-full max-h-96 object-cover rounded-lg"
      />
      <div className="flex justify-between items-center w-full mt-4">
        <button
          className="px-3 py-1 bg-gray-200 rounded"
          onClick={() => setIdx(idx === 0 ? images.length - 1 : idx - 1)}
          disabled={images.length <= 1}
        >
          Prev
        </button>
        <span className="text-sm text-gray-600">
          {idx + 1} / {images.length}
        </span>
        <button
          className="px-3 py-1 bg-gray-200 rounded"
          onClick={() => setIdx(idx === images.length - 1 ? 0 : idx + 1)}
          disabled={images.length <= 1}
        >
          Next
        </button>
      </div>
      <div className="mt-2 text-xs text-gray-500">{current.title}</div>
    </div>
  );
}

export default function Events() {
  const [events, setEvents] = useState<any[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState('');
  const [galleryByEvent, setGalleryByEvent] = useState<Record<string, any[]>>({});
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [carouselImages, setCarouselImages] = useState<any[]>([]);
  const [carouselTitle, setCarouselTitle] = useState('');

  // Fetch gallery for past events
  useEffect(() => {
    async function fetchGallery() {
      if (!events || events.length === 0) return;
      const today = '2025-10-06';
      const pastEvents = events.filter(ev => (ev.date && ev.date < today) || ev.status === 'completed');
      const galleryMap: Record<string, any[]> = {};

      for (const ev of pastEvents) {
        try {
          const res =
            (await window.galleryAPI?.getAll?.({ eventId: ev._id || ev.id })) ||
            (await import('@/lib/api').then(m => m.galleryAPI.getAll({ eventId: ev._id || ev.id })));
          const items = res.items || res.data || [];
          galleryMap[ev._id || ev.id] = items.filter((i: any) => i.type === 'image');
        } catch {
          galleryMap[ev._id || ev.id] = [];
        }
      }

      setGalleryByEvent(galleryMap);
    }
    fetchGallery();
  }, [events]);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      setEventsLoading(true);
      setEventsError('');
      try {
        const data = await eventsAPI.getAll();
        setEvents(data.events || data);
      } catch {
        setEventsError('Failed to fetch events');
      }
      setEventsLoading(false);
    };
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Events & Gallery</h1>
          <p className="text-lg text-gray-600">
            Stay updated with our upcoming events and relive memories from past gatherings.
          </p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Upcoming Events</h2>
          <div className="space-y-6 max-w-4xl mx-auto">
            {eventsLoading ? (
              <p className="text-center">Loading events...</p>
            ) : eventsError ? (
              <p className="text-center text-red-500">{eventsError}</p>
            ) : events.length === 0 ? (
              <p className="text-center text-gray-500">No upcoming events found.</p>
            ) : (
              events
                .filter(ev => {
                  const today = '2025-10-06';
                  return ev.date && ev.date >= today && ev.status !== 'completed';
                })
                .map(event => (
                  <Card key={event._id || event.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="mb-4 md:mb-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge
                              variant={
                                event.category === 'Academic'
                                  ? 'default'
                                  : event.category === 'Social'
                                  ? 'secondary'
                                  : 'outline'
                              }
                            >
                              {event.category}
                            </Badge>
                          </div>
                          <CardTitle className="text-xl">{event.title}</CardTitle>
                          <CardDescription className="text-base mt-2">{event.description}</CardDescription>
                        </div>
                        <Button className="bg-blue-600 hover:bg-blue-700">Register Now</Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Past Events</h2>
          <div className="space-y-6 max-w-4xl mx-auto">
            {eventsLoading ? (
              <p className="text-center">Loading events...</p>
            ) : eventsError ? (
              <p className="text-center text-red-500">{eventsError}</p>
            ) : (
              events
                .filter(ev => {
                  const today = '2025-10-06';
                  return (ev.date && ev.date < today) || ev.status === 'completed';
                })
                .map(event => (
                  <Card
                    key={event._id || event.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => {
                      setCarouselImages(galleryByEvent[event._id || event.id] || []);
                      setCarouselTitle(event.title);
                      setCarouselOpen(true);
                    }}
                  >
                    <CardHeader>
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <CardDescription className="text-base mt-2">{event.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        {galleryByEvent[event._id || event.id]?.length || 0} Photos
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        </div>
      </section>

      {/* Carousel Modal */}
      {carouselOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl"
              onClick={() => setCarouselOpen(false)}
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-center">{carouselTitle} - Gallery</h3>
            {carouselImages.length === 0 ? (
              <p className="text-center text-gray-500">No images uploaded for this event.</p>
            ) : (
              <Carousel images={carouselImages} />
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
