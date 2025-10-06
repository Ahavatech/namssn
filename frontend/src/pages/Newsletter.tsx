import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mail, Download, Calendar, Users, CheckCircle } from 'lucide-react';
import { useEffect, useState } from "react";

interface Newsletter {
  id: number;
  title: string;
  description: string;
  date: string;
  filename: string;
  uploadDate: string;
  fileUrl?: string;
}

export default function NewsletterPage() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("newsletters") : null;
    if (stored) {
      setNewsletters(JSON.parse(stored));
    } else {
      setNewsletters([]);
    }
  }, []);
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Newsletter</h1>
            <p className="text-lg text-gray-600 mb-8">
              Stay connected with NAMSSN OAU through our monthly newsletter featuring events, achievements, and community updates
            </p>
            
            {/* Newsletter Signup */}
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>Subscribe to Newsletter</span>
                </CardTitle>
                <CardDescription>
                  Get the latest updates delivered to your inbox
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input 
                  type="email" 
                  placeholder="Enter your email address" 
                />
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Subscribe Now
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter Archive */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Newsletter Archive</h2>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {newsletters.map((newsletter) => (
              <Card key={newsletter.id} className={`hover:shadow-lg transition-shadow ${newsletter.featured ? 'ring-2 ring-blue-200' : ''}`}>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center space-x-2 mb-2">
                        {newsletter.featured && (
                          <Badge variant="default">Latest Issue</Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl">{newsletter.title}</CardTitle>
                      <CardDescription className="text-base mt-2">
                        {newsletter.description}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          const apiUrl = import.meta.env.VITE_API_URL || "https://namssnapi.onrender.com/api";
                          const token = localStorage.getItem("token");
                          try {
                            const res = await fetch(`${apiUrl}/newsletters/${newsletter.id}/download`, {
                              method: "GET",
                              headers: token ? { Authorization: `Bearer ${token}` } : {},
                            });
                            if (!res.ok) throw new Error("Failed to fetch PDF");
                            const blob = await res.blob();
                            const url = window.URL.createObjectURL(blob);
                            window.open(url, "_blank");
                          } catch (err) {
                            alert("Unable to preview newsletter PDF.");
                          }
                        }}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download PDF
                      </Button>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>{newsletter.date}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Content Preview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What's Inside Our Newsletter</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Regular Features</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {newsletters.map((item, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{item.title}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Newsletter Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Subscribers</span>
                    <span className="text-lg font-bold text-blue-600">500+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Monthly Issues</span>
                    <span className="text-lg font-bold text-blue-600">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Years Published</span>
                    <span className="text-lg font-bold text-blue-600">5+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Open Rate</span>
                    <span className="text-lg font-bold text-blue-600">85%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Don't Miss Out!</h2>
            <p className="text-lg text-gray-600 mb-8">
              Join our community of mathematical science enthusiasts and stay informed about everything happening in our department.
            </p>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Subscribe to Newsletter
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}