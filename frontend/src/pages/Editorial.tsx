import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Calendar, User, Search, BookOpen, TrendingUp } from 'lucide-react';

export default function Editorial() {
  const featuredArticles = [
    {
      id: 1,
      title: 'The Beauty of Mathematical Proofs',
      excerpt: 'Exploring the elegance and logic behind mathematical demonstrations...',
      author: 'Dr. Sarah Johnson',
      date: '2024-11-15',
      category: 'Mathematics',
      readTime: '5 min read'
    },
    {
      id: 2,
      title: 'Applications of Statistics in Modern Research',
      excerpt: 'How statistical methods are revolutionizing scientific discovery...',
      author: 'Prof. Michael Chen',
      date: '2024-11-10',
      category: 'Statistics',
      readTime: '7 min read'
    },
    {
      id: 3,
      title: 'Career Paths for Mathematics Graduates',
      excerpt: 'Exploring diverse opportunities in industry, academia, and research...',
      author: 'Alumni Network',
      date: '2024-11-05',
      category: 'Career',
      readTime: '6 min read'
    }
  ];

  const recentPosts = [
    {
      title: 'Understanding Complex Numbers',
      category: 'Mathematics',
      date: '2024-11-20'
    },
    {
      title: 'Data Science Fundamentals',
      category: 'Statistics',
      date: '2024-11-18'
    },
    {
      title: 'Mathematical Modeling in Biology',
      category: 'Applied Math',
      date: '2024-11-16'
    },
    {
      title: 'The History of Calculus',
      category: 'History',
      date: '2024-11-14'
    }
  ];

  const categories = [
    { name: 'Mathematics', count: 15 },
    { name: 'Statistics', count: 12 },
    { name: 'Applied Math', count: 8 },
    { name: 'Career', count: 6 },
    { name: 'Research', count: 10 },
    { name: 'Opinion', count: 7 }
  ];

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
                            <span>{new Date(article.date).toLocaleDateString()}</span>
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
                  {categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between py-2 hover:bg-gray-50 px-2 rounded cursor-pointer">
                      <span className="text-sm font-medium">{category.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {category.count}
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
                        <span>{new Date(post.date).toLocaleDateString()}</span>
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