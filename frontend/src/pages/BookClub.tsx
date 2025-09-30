import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar, Users, Star } from 'lucide-react';

export default function BookClub() {
  const currentBook = {
    title: "The Man Who Loved Only Numbers",
    author: "Paul Hoffman",
    description: "The story of Paul Erdős and the search for mathematical truth",
    dueDate: "January 15, 2025",
    progress: 65
  };

  const bookList = [
    { title: "A Beautiful Mind", author: "Sylvia Nasar", status: "completed", rating: 4.5 },
    { title: "The Code Book", author: "Simon Singh", status: "completed", rating: 4.2 },
    { title: "Gödel, Escher, Bach", author: "Douglas Hofstadter", status: "reading", rating: null },
    { title: "The Joy of x", author: "Steven Strogatz", status: "upcoming", rating: null },
  ];

  const upcomingEvents = [
    {
      title: "Monthly Book Discussion",
      date: "January 15, 2025",
      time: "6:00 PM",
      location: "Mathematics Department Seminar Room"
    },
    {
      title: "Guest Author Session",
      date: "February 10, 2025",
      time: "4:00 PM",
      location: "Virtual Meeting"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Book Club</h1>
            <p className="text-lg text-gray-600">
              Join our community of readers exploring mathematics through literature
            </p>
          </div>
        </div>
      </section>

      {/* Current Book */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Currently Reading</h2>
          
          <div className="max-w-2xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-24 h-32 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-blue-600" />
                </div>
                <CardTitle className="text-xl">{currentBook.title}</CardTitle>
                <CardDescription className="text-base">by {currentBook.author}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 text-center">{currentBook.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Reading Progress</span>
                    <span>{currentBook.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${currentBook.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="text-center">
                  <Badge variant="secondary">Due: {currentBook.dueDate}</Badge>
                </div>
                
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Join Discussion
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Book List */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Reading List</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookList.map((book, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{book.title}</CardTitle>
                        <CardDescription>by {book.author}</CardDescription>
                      </div>
                      <Badge 
                        variant={book.status === 'completed' ? 'default' : book.status === 'reading' ? 'secondary' : 'outline'}
                      >
                        {book.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  {book.rating && (
                    <CardContent>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{book.rating}</span>
                        <span className="text-sm text-gray-500">/ 5.0</span>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Upcoming Events</h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {upcomingEvents.map((event, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <CardDescription className="mt-2">
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{event.date}</span>
                          </div>
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center space-x-1 mt-1">
                          <Users className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      RSVP
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}