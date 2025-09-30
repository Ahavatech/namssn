import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, BookOpen, Users, Award, ArrowRight, Bell, GraduationCap, Edit3, ShoppingBag } from 'lucide-react';

export default function Index() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Announcements Bar */}
      <div className="bg-blue-600 text-white py-3">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-2 text-sm">
            <Bell className="h-4 w-4" />
            <span className="font-medium">Latest:</span>
            <span>Registration for Mathematics Seminar 2024 is now open!</span>
            <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700 ml-2">
              Learn More
            </Button>
          </div>
        </div>
      </div>

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

      {/* Upcoming Events */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
            <p className="text-lg text-gray-600">Stay updated with our latest academic and social programs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Academic</Badge>
                  <span className="text-sm text-gray-500">Dec 15, 2024</span>
                </div>
                <CardTitle>Mathematics Seminar 2024</CardTitle>
                <CardDescription>
                  Annual mathematics seminar featuring guest speakers and research presentations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm">Learn More</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Social</Badge>
                  <span className="text-sm text-gray-500">Dec 20, 2024</span>
                </div>
                <CardTitle>End of Year Party</CardTitle>
                <CardDescription>
                  Celebrate the year's achievements with fellow mathematical science students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm">Learn More</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Workshop</Badge>
                  <span className="text-sm text-gray-500">Jan 10, 2025</span>
                </div>
                <CardTitle>Research Methods Workshop</CardTitle>
                <CardDescription>
                  Learn essential research methodologies in mathematical sciences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm">Register Now</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}