import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Eye, Heart } from 'lucide-react';
import { useState } from 'react';

export default function About() {
  const [imageLoadError, setImageLoadError] = useState<Record<string, boolean>>({});
  const executives = [
    { name: 'Jacobs Odunayo M.', position: 'President', phone: '09052029197', image: 'president.jpg' },
    { name: 'Qazeem Anuoluwapo M.', position: 'Vice President', phone: '07089225441', image: 'vice_president.jpg' },
    { name: 'Adeyemi Adesewa', position: 'General Secretary', phone: '09138904056', image: 'gen_sec.jpg' },
    { name: 'Adetola Emmanuel', position: 'Assistant General Secretary', phone: '08081995085', image: 'ass_gen_sec.jpg' },
    { name: 'Osuolale Anuoluwapo', position: 'Academic Director', phone: '08050230712', image: 'academic_dir.jpg' },
    { name: 'Adekunle Ibukunoluwa A.', position: 'Editor in Chief', phone: '08142717108', image: 'eic.jpg' },
    { name: 'Akintunde Oluwafisayomi', position: 'Treasurer', phone: '07025138913', image: 'treasurer.jpg' },
    { name: 'Olatayo Excellence', position: 'Librarian', phone: '0705466453', image: 'lib.jpg' },
    { name: 'Emmanuel Isaac V.', position: 'Financial Secretary', phone: '08166786346', image: 'fin_sec.jpg' },
    { name: 'Idowu Esther', position: 'Assistant Librarian', phone: '08104397406', image: 'ass_lib.jpg' },
    { name: 'Adesoye Qodir A.', position: 'Director Social', phone: '07016560860', image: 'dir_social.jpg' },
    { name: 'Kewulola Murisuq O.', position: 'Director Sports', phone: '07016411404', image: 'dir_sports.jpg' },
    { name: 'Oyekanmi Titiloye', position: 'PRO', phone: '07067846902', image: 'pro.jpg' },
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
                    <div className="w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full border-2 border-blue-200">
                      <img 
                        src={imageLoadError[exec.name] ? '/assets/namssn-logo.png' : `/assets/executives/${exec.image}`}
                        alt={exec.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={() => {
                          setImageLoadError(prev => ({ ...prev, [exec.name]: true }));
                        }}
                      />
                    </div>
                    <CardTitle className="text-lg">{exec.name}</CardTitle>
                    <Badge variant="secondary" className="mx-auto">
                      {exec.position}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <a 
                      href={`https://wa.me/234${exec.phone.replace(/^0/, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 text-sm text-center font-semibold block transition-colors"
                    >
                      {exec.phone}
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}