import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Target, Eye, Heart } from 'lucide-react';

export default function About() {
  const executives = [
    { name: 'President', position: 'Chief Executive', bio: 'Leading the association with vision and dedication' },
    { name: 'Vice President', position: 'Deputy Leader', bio: 'Supporting leadership and coordinating activities' },
    { name: 'Secretary General', position: 'Administrative Head', bio: 'Managing records and communications' },
    { name: 'Treasurer', position: 'Financial Officer', bio: 'Overseeing financial operations and budgets' },
    { name: 'Director of Socials', position: 'Events Coordinator', bio: 'Organizing social and cultural events' },
    { name: 'Director of Academics', position: 'Academic Coordinator', bio: 'Coordinating academic programs and resources' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About NAMSSN OAU</h1>
            <p className="text-lg text-gray-600">
              Learn about our history, mission, and the dedicated team leading our association
            </p>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our History</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                The Nigerian Association of Mathematical Science Students of Nigeria (NAMSSN), OAU Chapter, 
                was established to foster excellence in mathematical sciences education and create a vibrant 
                community of learners and researchers at Obafemi Awolowo University.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Since our inception, we have been committed to bridging the gap between theoretical knowledge 
                and practical application, providing students with the resources, support, and opportunities 
                needed to excel in their academic pursuits and future careers.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our association has grown to become a cornerstone of the Department of Mathematics, 
                organizing seminars, workshops, and social events that enrich the academic experience 
                of mathematical science students.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Foundation</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <Eye className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="text-xl">Our Vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-center">
                    To be the leading association fostering excellence in mathematical sciences 
                    education and research, producing graduates who contribute meaningfully to 
                    society and advance the frontiers of mathematical knowledge.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="text-xl">Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-center">
                    To empower mathematical science students through quality education, 
                    research opportunities, professional development, and community engagement 
                    while promoting academic excellence and innovation.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <Heart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="text-xl">Our Values</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-gray-700 text-sm space-y-2">
                    <li>• Excellence in academic pursuits</li>
                    <li>• Integrity and ethical conduct</li>
                    <li>• Collaboration and teamwork</li>
                    <li>• Innovation and creativity</li>
                    <li>• Continuous learning and growth</li>
                    <li>• Service to community</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Council */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Executive Council</h2>
              <p className="text-lg text-gray-600">
                Meet the dedicated leaders driving our association forward
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {executives.map((exec, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="text-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-10 w-10 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">{exec.name}</CardTitle>
                    <Badge variant="secondary" className="mx-auto">
                      {exec.position}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm text-center">{exec.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Committees Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Committees</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Academic Committee</CardTitle>
                  <CardDescription>
                    Organizes seminars, workshops, and academic support programs
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Social Committee</CardTitle>
                  <CardDescription>
                    Plans social events, cultural activities, and community engagement
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Editorial Committee</CardTitle>
                  <CardDescription>
                    Manages publications, newsletters, and content creation
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Welfare Committee</CardTitle>
                  <CardDescription>
                    Addresses student welfare and support services
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}