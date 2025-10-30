import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Mail, Instagram, Twitter, Facebook } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-lg text-gray-600">
              Connect with NAMSSN OAU Chapter through our various channels
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Two-column responsive layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Left Column */}
            <div className="space-y-6">
              
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    Here's how you can reach us directly
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-sm text-gray-600">
                        Department of Mathematics<br />
                        Obafemi Awolowo University<br />
                        Ile-Ife, Osun State, Nigeria
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-gray-600">
                        <a
                          href="mailto:namssnoau@gmail.com"
                          className="hover:text-blue-600 transition-colors"
                        >
                          namssnoau@gmail.com
                        </a>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card>
                <CardHeader>
                  <CardTitle>Follow Us</CardTitle>
                  <CardDescription>
                    Stay connected through our social media channels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <a
                      href="https://www.facebook.com/share/1BuboSdSCg/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="icon" className="hover:bg-blue-100">
                        <Facebook className="h-4 w-4" />
                      </Button>
                    </a>
                    <a
                      href="https://instagram.com/namssnoau"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="icon" className="hover:bg-pink-100">
                        <Instagram className="h-4 w-4" />
                      </Button>
                    </a>
                    <a
                      href="https://x.com/namssnoau"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="icon" className="hover:bg-gray-100">
                        <Twitter className="h-4 w-4" />
                      </Button>
                    </a>
                    <a href="mailto:namssnoau@gmail.com">
                      <Button variant="outline" size="icon" className="hover:bg-red-100">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Google Map */}
            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg overflow-hidden h-80">
                    <iframe
                      title="Department of Mathematics, OAU"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.1354848783467!2d4.528864974085091!3d7.524432611381965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10478fd08a745699%3A0x3a6a46d2f20dbf62!2sDepartment%20of%20Mathematics%2C%20OAU!5e0!3m2!1sen!2sng!4v1730308700000!5m2!1sen!2sng"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
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
