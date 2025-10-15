import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mail, Download, Calendar, Users, CheckCircle } from 'lucide-react';
import { useEffect, useState } from "react";
import { newsletterAPI } from '@/lib/api';

interface Newsletter {
  id: number;
  title: string;
  description: string;
  date: string;
  filename: string;
  uploadDate: string;
  fileUrl?: string;
  featured?: boolean;
}

export default function NewsletterPage() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);

  useEffect(() => {
    let mounted = true;
    const fetchNewsletters = async () => {
      try {
        const data = await newsletterAPI.getAll();
        const rawList = Array.isArray(data) ? data : data.newsletters || data.data || [];
        // Normalize backend fields to our Newsletter interface
        const list: Newsletter[] = rawList.map((item: any) => ({
          id: item._id || item.id || String(item._id || item.id || ''),
          title: item.title || item.name || '',
          description: item.description || item.summary || '',
          date: item.publishDate ? new Date(item.publishDate).toISOString().split('T')[0] : (item.date || item.uploadDate || ''),
          filename: item.filename || (item.pdfUrl ? item.pdfUrl.split('/').pop() || '' : ''),
          uploadDate: item.uploadDate || item.publishDate || '',
          fileUrl: item.pdfUrl || item.fileUrl || item.pdf || undefined,
        }));

        // Mark the most recent as featured (optional)
        if (list.length > 0) {
          list[0].featured = true;
        }

        if (!mounted) return;
        setNewsletters(list);
        try {
          localStorage.setItem('newsletters', JSON.stringify(list));
        } catch {}
      } catch (err) {
        // Only fall back to localStorage when backend is unreachable
        const stored = typeof window !== 'undefined' ? localStorage.getItem('newsletters') : null;
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) setNewsletters(parsed as Newsletter[]);
            else setNewsletters([]);
          } catch {
            setNewsletters([]);
          }
        } else {
          setNewsletters([]);
        }
      }
    };
    fetchNewsletters();
    return () => { mounted = false };
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
                          const apiOrigin = apiUrl.replace(/\/api\/?$/, '');
                          const token = localStorage.getItem("token");
                          try {
                            // Prefer opening an API-hosted preview URL using the filename
                            if (newsletter.filename) {
                              // Track download (best-effort)
                              try {
                                await fetch(`${apiUrl}/newsletters/${newsletter.id}/download`, {
                                  method: 'POST',
                                  headers: token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' },
                                });
                              } catch {}

                              const previewUrl = `${apiOrigin}/api/newsletters/public/${encodeURIComponent(newsletter.filename)}`;
                              window.open(previewUrl, '_blank');
                              return;
                            }

                            // Fallback: request PDF blob from API download endpoint
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