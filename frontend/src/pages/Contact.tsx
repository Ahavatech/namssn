import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Instagram, Twitter, Facebook } from 'lucide-react';

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
              Get in touch with NAMSSN OAU Chapter. We'd love to hear from you!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">First Name</label>
                    <Input placeholder="Enter your first name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Last Name</label>
                    <Input placeholder="Enter your last name" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                  <Input type="email" placeholder="Enter your email address" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Subject</label>
                  <Input placeholder="What is this about?" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Message</label>
                  <Textarea 
                    placeholder="Tell us more about your inquiry..."
                    className="min-h-[120px]"
                  />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Send Message
                </Button>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
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
                      <p className="text-sm text-gray-600">Department of Mathematics<br />Obafemi Awolowo University<br />Ile-Ife, Osun State, Nigeria</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-gray-600">
                        <a href="mailto:namssnoau@gmail.com" className="hover:text-blue-600 transition-colors">
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
                    <a href="https://www.facebook.com/share/1BuboSdSCg/" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="icon" className="hover:bg-blue-100">
                        <Facebook className="h-4 w-4" />
                      </Button>
                    </a>
                    <a href="https://instagram.com/namssnoau" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="icon" className="hover:bg-pink-100">
                        <Instagram className="h-4 w-4" />
                      </Button>
                    </a>
                    <a href="https://x.com/namssnoau" target="_blank" rel="noopener noreferrer">
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

              {/* Map Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Google Maps Integration</p>
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