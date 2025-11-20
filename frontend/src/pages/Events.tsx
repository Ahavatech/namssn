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
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  const formatDate = (d: any) => {
    if (!d) return '';
    const dt = d instanceof Date ? d : new Date(d);
    if (Number.isNaN(dt.getTime())) return '';
    return dt.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatTime = (t: any) => {
    if (!t) return '';
    // if already a Date
    if (t instanceof Date) {
      return t.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
    }
    // if string like 'HH:MM' or 'HH:MM:SS'
    if (typeof t === 'string') {
      // if contains AM/PM, return as-is trimmed
      if (/\b(AM|PM|am|pm)\b/.test(t)) return t.trim();
      const parts = t.split(':');
      if (parts.length >= 2) {
        const hh = parseInt(parts[0], 10);
        const mm = parseInt(parts[1], 10);
        if (!Number.isNaN(hh) && !Number.isNaN(mm)) {
          const dt = new Date();
          dt.setHours(hh, mm, parts[2] ? parseInt(parts[2], 10) : 0, 0);
          return dt.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
        }
      }
      return t;
    }
    return '';
  };

  // Fetch gallery for past events
  useEffect(() => {
    async function fetchGallery() {
      if (!events || events.length === 0) return;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const pastEvents = events.filter(ev => {
        const d = ev.date ? new Date(ev.date) : null;
        return (d && d < today) || ev.status === 'completed';
      });
      const galleryMap: Record<string, any[]> = {};

      for (const ev of pastEvents) {
        try {
          const res =
            (await window.galleryAPI?.getAll?.({ eventId: ev._id || ev.id })) ||
            (await import('@/lib/api').then(m => m.galleryAPI.getAll({ eventId: ev._id || ev.id })));
          const items = res.items || res.data || [];

          // helper to normalize URL to a filename key for deduplication
          const getFileKey = (u: string | undefined) => {
            if (!u) return '';
            try {
              // remove querystring
              const noQuery = u.split('?')[0];
              // get last path segment
              const parts = noQuery.split('/').filter(Boolean);
              const last = parts.length ? parts[parts.length - 1] : noQuery;
              return decodeURIComponent(last).toLowerCase();
            } catch (e) {
              return (u || '').toLowerCase();
            }
          };

          // start with featuredImage if present
          const images: any[] = [];
          if (ev.featuredImage) images.push({ url: ev.featuredImage, title: 'Event Flyer' });

          // include any paths stored on the event.gallery array
          if (Array.isArray(ev.gallery) && ev.gallery.length > 0) {
            for (const p of ev.gallery) {
              if (p) images.push({ url: p, title: '' });
            }
          }

          // include gallery API image items (avoid duplicates) — normalize by filename
          const apiImagesRaw = items.filter((i: any) => i.type === 'image');
          const apiImages = apiImagesRaw.map((i: any) => ({ url: i.url || i.path || i.thumbnail || i.imageUrl, title: i.title || '' }));
          // diagnostic log to help track unexpected test uploads
          try {
            // eslint-disable-next-line no-console
            console.debug('Gallery API items for event', ev._id || ev.id, apiImagesRaw.map((a: any) => ({ id: a._id, url: a.url || a.path }))); 
          } catch (e) {}

          const seen = new Set(images.map(img => getFileKey(img.url)));
          for (const img of apiImages) {
            const key = getFileKey(img.url);
            if (!seen.has(key) && key) {
              images.push(img);
              seen.add(key);
            }
          }

          galleryMap[ev._id || ev.id] = images;
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
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const d = ev.date ? new Date(ev.date) : null;
                  return (d && d >= today && ev.status !== 'completed');
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
                        <Button
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={async () => {
                            // open modal with full description and images
                            setSelectedEvent(event);
                            setCarouselTitle(event.title);
                            // build images: featuredImage first, then gallery items
                            const images: any[] = [];
                            if (event.featuredImage) images.push({ url: event.featuredImage, title: 'Event Flyer' });
                            try {
                              const res = (await window.galleryAPI?.getAll?.({ eventId: event._id || event.id })) ||
                                (await import('@/lib/api').then(m => m.galleryAPI.getAll({ eventId: event._id || event.id })));
                              const items = res.items || res.data || [];
                              const imgs = items.filter((i: any) => i.type === 'image').map((i: any) => ({ url: i.url || i.path || i.thumbnail || i.imageUrl, title: i.title || '' }));
                              setCarouselImages([...images, ...imgs]);
                            } catch {
                              setCarouselImages(images);
                            }
                            setCarouselOpen(true);
                          }}
                        >
                          See More
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(event.date)}</span>
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
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const d = ev.date ? new Date(ev.date) : null;
                  return (d && d < today) || ev.status === 'completed';
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
                          <span>{formatDate(event.date)}</span>
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
              onClick={() => {
                setCarouselOpen(false);
                setSelectedEvent(null);
                setCarouselImages([]);
              }}
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-2 text-center">{carouselTitle}</h3>
            {selectedEvent && <p className="text-sm text-gray-700 mb-4">{selectedEvent.description}</p>}
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
