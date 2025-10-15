import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import { eventsAPI, newsletterAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, BookOpen, Users, Award, ArrowRight, Bell, GraduationCap, Edit3, ShoppingBag, Download } from 'lucide-react';

// Newsletter type
interface Newsletter {
  id: number;
  title: string;
  description: string;
  date: string;
  filename: string;
  uploadDate: string;
  fileUrl?: string;
}

export default function Index() {
  // Event fetching state
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState('');

  // Newsletter state
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);

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

  useEffect(() => {
    let mounted = true;
    const fetchNewsletters = async () => {
      try {
        const data = await newsletterAPI.getAll();
        const rawList = Array.isArray(data) ? data : data.newsletters || data.data || [];
        const list: Newsletter[] = rawList.map((item: any) => ({
          id: item._id || item.id || Number(item.id) || 0,
          title: item.title || item.name || '',
          description: item.description || item.summary || '',
          date: item.publishDate ? new Date(item.publishDate).toISOString().split('T')[0] : (item.date || item.uploadDate || ''),
          filename: item.filename || (item.pdfUrl ? item.pdfUrl.split('/').pop() || '' : ''),
          uploadDate: item.uploadDate || item.publishDate || '',
          fileUrl: item.pdfUrl || item.fileUrl || item.pdf || undefined,
        }));
        if (!mounted) return;
        setNewsletters(list);
        try { localStorage.setItem('newsletters', JSON.stringify(list)); } catch {}
      } catch (err) {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('newsletters') : null;
        if (stored) {
          try { setNewsletters(JSON.parse(stored)); } catch { setNewsletters([]); }
        } else setNewsletters([]);
      }
    };
    fetchNewsletters();
    return () => { mounted = false };
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const upcomingEvents = events.filter(ev => ev.date && ev.date >= today);
  const latestNewsletters = newsletters.slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Hero Section */}
      <section id="home" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="inline-flex items-center space-x-6 mb-6">
                <img 
                  src="/assets/namssn-logo.png" 
                  alt="NAMSSN Logo" 
                  className="h-20 w-20 object-contain"
                />
                <div className="text-left">
                  <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">NAMSSN OAU</h1>
                  <p className="text-lg text-gray-600">Nigerian Association of Mathematical Science Students</p>
                  <p className="text-sm text-blue-600 font-medium mt-1">Obafemi Awolowo University Chapter</p>
                </div>
              </div>
            </div>
            <div className="mb-8">
              <p className="text-xl text-blue-600 font-semibold mb-4">
                "Excellence in Mathematical Sciences Education"
              </p>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Welcome to the official online hub for NAMSSN OAU Chapter. 
                Discover academic resources, engage with our community, and stay updated with the latest in mathematical sciences.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <a href="/academics" className="flex items-center">
                  Explore Resources
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="lg">
                <a href="/about">Learn About Us</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive resources and programs designed to enhance your mathematical sciences journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <CardHeader className="text-center">
                <GraduationCap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Academic Resources</CardTitle>
                <CardDescription>
                  Past questions, tutorials, notes organized by academic parts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" className="w-full">
                  <a href="/academics">Access Resources</a>
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <CardHeader className="text-center">
                <Edit3 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Editorial Section</CardTitle>
                <CardDescription>
                  Articles, science facts, and opinion pieces from our editorial team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" className="w-full">
                  <a href="/editorial">Read Articles</a>
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <CardHeader className="text-center">
                <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Events & Gallery</CardTitle>
                <CardDescription>
                  Academic seminars, social programs, and photo highlights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" className="w-full">
                  <a href="/events">View Events</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Department Image Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Home</h2>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                src="/assets/department.jpg" 
                alt="Department of Mathematics, OAU" 
                className="w-full h-64 sm:h-80 object-cover"
              />
            </div>
            <p className="text-lg text-gray-600 mt-6">
              Department of Mathematics, Obafemi Awolowo University, Ile-Ife
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Events (Dynamic) */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
            <p className="text-lg text-gray-600">Stay updated with our latest academic and social programs</p>
          </div>
          {eventsLoading ? (
            <p className="text-center">Loading events...</p>
          ) : eventsError ? (
            <p className="text-center text-red-500">{eventsError}</p>
          ) : upcomingEvents.length === 0 ? (
            <p className="text-center text-gray-500">No upcoming events found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event: any) => (
                <Card key={event._id || event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{event.category || 'Event'}</Badge>
                      <span className="text-sm text-gray-500">{event.date} {event.time}</span>
                    </div>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {event.featuredImage && (
                      <img src={event.featuredImage} alt="Event flyer" className="mb-2 max-h-32 rounded" />
                    )}
                    <div className="text-sm text-gray-600 mb-2">Location: {event.location}</div>
                    {event.description && event.description.length > 120 && (
                      <Button variant="outline" size="sm">Learn More</Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Newsletters</h2>
            <p className="text-lg text-gray-600">Read our latest publications and updates</p>
          </div>
          {latestNewsletters.length === 0 ? (
            <p className="text-center text-gray-500">No newsletters available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestNewsletters.map((newsletter) => (
                <Card key={newsletter.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{newsletter.title}</CardTitle>
                    <CardDescription>{newsletter.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-600 mb-2">Published: {new Date(newsletter.date).toLocaleDateString()}</div>
                    <Button variant="outline" size="sm" onClick={async () => {
                      const apiUrl = import.meta.env.VITE_API_URL || "https://namssnapi.onrender.com/api";
                      const apiOrigin = apiUrl.replace(/\/api\/?$/, '');
                      try {
                        if (newsletter.filename) {
                          // best-effort tracking
                          try { await fetch(`${apiUrl}/newsletters/${newsletter.id}/download`, { method: 'POST' }); } catch {}
                          window.open(`${apiOrigin}/api/newsletters/public/${encodeURIComponent(newsletter.filename)}`, '_blank');
                          return;
                        }
                        window.open(newsletter.fileUrl || `/newsletters/${newsletter.filename}`, "_blank");
                      } catch {
                        window.open(newsletter.fileUrl || `/newsletters/${newsletter.filename}`, "_blank");
                      }
                    }}>
                      <Download className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}