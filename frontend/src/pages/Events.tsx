import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import { eventsAPI } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, Users, Image, Video } from 'lucide-react';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      setEventsLoading(true);
      setEventsError('');
      try {
        const data = await eventsAPI.getAll();
        setEvents(data.events || data);
      } catch (err) {
        setEventsError('Failed to fetch events');
      }
      setEventsLoading(false);
    };
    fetchEvents();
  }, []);

  const pastEvents = [
    {
      title: "Statistics Conference 2024",
      date: "November 2024",
      images: 12,
      videos: 3
    },
    {
      title: "Freshers Welcome Party",
      date: "October 2024",
      images: 25,
      videos: 2
    },
    {
      title: "Mathematical Modeling Competition",
      date: "September 2024",
      images: 18,
      videos: 1
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Events & Gallery</h1>
            <p className="text-lg text-gray-600">
              Stay updated with our upcoming events and relive memories from past gatherings
            </p>
          </div>
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
              events.map((event: any) => (
                <Card key={event._id || event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="mb-4 md:mb-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant={event.category === 'Academic' ? 'default' : event.category === 'Social' ? 'secondary' : 'outline'}>
                            {event.category}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl">{event.title}</CardTitle>
                        <CardDescription className="text-base mt-2">
                          {event.description}
                        </CardDescription>
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Register Now
                      </Button>
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

      {/* Past Events Gallery */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Past Events Gallery</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {pastEvents.map((event, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <Image className="h-16 w-16 text-gray-400" />
                  </div>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <CardDescription>{event.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Image className="h-4 w-4" />
                      <span>{event.images} Photos</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Video className="h-4 w-4" />
                      <span>{event.videos} Videos</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    View Gallery
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}