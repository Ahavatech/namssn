import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

export default function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://namssnapi.onrender.com/api';
        const res = await fetch(`${apiUrl}/articles/${id}`);
        if (!res.ok) throw new Error('Failed to fetch article');
        const data = await res.json();
        if (!mounted) return;
        setArticle(data);
      } catch (err) {
        toast({ title: 'Failed to load article', description: (err as any)?.message || '' });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false };
  }, [id]);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: article.title, text: article.excerpt || '', url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        toast({ title: 'Link copied', description: 'Article link copied to clipboard' });
      } else {
        // fallback
        window.prompt('Copy this link', url);
      }
    } catch (err) {
      toast({ title: 'Share failed', description: (err as any)?.message || '' });
    }
  };

  if (loading) return <div className="min-h-screen"><Header /><div className="container mx-auto py-24">Loading...</div><Footer /></div>;
  if (!article) return <div className="min-h-screen"><Header /><div className="container mx-auto py-24">Article not found</div><Footer /></div>;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          {article.featuredImage && (
            <img src={article.featuredImage} alt={article.title} className="w-full rounded mb-6 object-cover" />
          )}

          <h1 className="text-3xl font-bold mb-3">{article.title}</h1>

          <div className="flex items-center text-sm text-gray-500 mb-6 space-x-4">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(article.publishDate || article.createdAt || article.date).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="prose max-w-none mb-6" dangerouslySetInnerHTML={{ __html: article.content || article.body }} />

          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
            <Button onClick={handleShare}>
              <Share2 className="mr-2" /> Share
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
