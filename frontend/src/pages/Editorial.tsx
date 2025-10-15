import Header from '@/components/Header';
import { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Calendar, User, Search, BookOpen, TrendingUp } from 'lucide-react';

export default function Editorial() {
  const [featuredArticles, setFeaturedArticles] = useState<any[]>([]);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [allArticles, setAllArticles] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');


  // Canonical categories (kept in sync with Admin.categoriesList)
  const categoriesList = [
    'Mathematics',
    'Applied Mathematics',
    'Statistics & Data Science',
    'Research & Innovation',
    'Opinion & Editorials',
    'Career & Development',
    'Campus & Culture'
  ];

  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    categoriesList.forEach(c => { initial[c] = 0 });
    return initial;
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://namssnapi.onrender.com/api';
        // Fetch a larger set to compute category counts reliably (server limits may apply)
        const res = await fetch(`${apiUrl}/articles?status=published&limit=500`);
        if (!res.ok) throw new Error('Failed to fetch articles');
        const data = await res.json();
        const articles = data.articles || data || [];
        if (!mounted) return;
  setAllArticles(articles);
  setFeaturedArticles(articles.slice(0, 3));
  setRecentPosts(articles.slice(0, 6));

        // Compute category counts using canonical categoriesList
        const counts: Record<string, number> = {};
        categoriesList.forEach(c => counts[c] = 0);
        articles.forEach((a: any) => {
          // match category strings exactly to the canonical list; otherwise increment 'Other'
          const found = categoriesList.find(c => c.toLowerCase() === (a.category || '').toLowerCase());
          if (found) counts[found]++;
        });
        setCategoryCounts(counts);
      } catch (err) {
        // ignore errors, leave lists empty
      }
    })();
    return () => { mounted = false };
  }, []);

  // Debounce the search query
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Filter articles client-side when debouncedQuery changes
  useEffect(() => {
    if (!debouncedQuery) {
      setFeaturedArticles(allArticles.slice(0, 3));
      setRecentPosts(allArticles.slice(0, 6));
      return;
    }

    const q = debouncedQuery.toLowerCase();
    const filtered = allArticles.filter(a => {
      return (
        (a.title || '').toLowerCase().includes(q) ||
        (a.excerpt || '').toLowerCase().includes(q) ||
        (a.content || a.body || '').toLowerCase().includes(q) ||
        (a.author || '').toLowerCase().includes(q) ||
        (a.category || '').toLowerCase().includes(q)
      );
    });

    setFeaturedArticles(filtered.slice(0, 3));
    setRecentPosts(filtered.slice(0, 6));
  }, [debouncedQuery, allArticles]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Editorial Section</h1>
            <p className="text-lg text-gray-600 mb-8">
              Discover insightful articles, research findings, and thought-provoking content from our editorial team
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search articles..." 
                className="pl-10 pr-4 py-2"
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e.target.value)}
              />
            </div>

            
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Featured Articles */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Articles</h2>
              <div className="space-y-6">
                {featuredArticles.map((article) => (
                  <Card key={article.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">{article.category}</Badge>
                        <span className="text-sm text-gray-500">{article.readTime}</span>
                      </div>
                      <CardTitle className="text-xl hover:text-blue-600 cursor-pointer">
                        {article.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {article.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{article.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(article.publishDate || article.createdAt || article.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Read More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categoriesList.map((category, index) => (
                    <div key={index} className="flex items-center justify-between py-2 hover:bg-gray-50 px-2 rounded cursor-pointer">
                      <span className="text-sm font-medium">{category}</span>
                      <Badge variant="outline" className="text-xs">
                        {categoryCounts[category] ?? 0}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Recent Posts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPosts.map((post, index) => (
                    <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0">
                      <h4 className="font-medium text-sm hover:text-blue-600 cursor-pointer mb-1">
                        {post.title}
                      </h4>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <Badge variant="outline" className="text-xs">
                          {post.category}
                        </Badge>
                        <span>{new Date(post.publishDate || post.createdAt || post.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}