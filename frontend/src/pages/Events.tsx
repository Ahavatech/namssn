import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, Users, Image, Video } from 'lucide-react';

export default function Events() {
  const upcomingEvents = [
    {
      id: 1,
      title: "Mathematics Seminar 2024",
      date: "December 15, 2024",
      time: "2:00 PM - 5:00 PM",
      location: "Mathematics Department Auditorium",
      category: "Academic",
      description: "Annual mathematics seminar featuring guest speakers and research presentations from leading mathematicians.",
      image: "/assets/placeholder-event.jpg"
    },
    {
      id: 2,
      title: "End of Year Party",
      date: "December 20, 2024",
      time: "6:00 PM - 10:00 PM",
      location: "Student Center Hall",
      category: "Social",
      description: "Celebrate the year's achievements with fellow mathematical science students, awards ceremony, and entertainment.",
      image: "/assets/placeholder-event.jpg"
    },
    {
      id: 3,
      title: "Research Methods Workshop",
      date: "January 10, 2025",
      time: "10:00 AM - 4:00 PM",
      location: "Computer Lab 1",
      category: "Workshop",
      description: "Learn essential research methodologies and tools for mathematical sciences research projects.",
      image: "/assets/placeholder-event.jpg"
    }
  ];

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
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
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
            ))}
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

      {/* Year in Review */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Year in Review</h2>
            <p className="text-lg text-gray-600 mb-8">
              Explore our comprehensive year-in-review archives featuring highlights from academic sessions
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle>2023/2024 Session</CardTitle>
                  <CardDescription>Complete archive of events, achievements, and memories</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full">
                    View Archive
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle>2022/2023 Session</CardTitle>
                  <CardDescription>Previous session highlights and milestone moments</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full">
                    View Archive
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}