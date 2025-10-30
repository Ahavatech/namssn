import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FolderOpen, Download, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { academicAPI } from '@/lib/api';

export default function Academics() {
  const [links, setLinks] = useState({
    mathematics: { part1: '', part2: '', part3: '', part4: '' },
    statistics: { part1: '', part2: '', part3: '', part4: '' }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    academicAPI.getLinks()
      .then((data) => {
        setLinks({
          mathematics: {
            part1: data.mathematics?.part1 || '',
            part2: data.mathematics?.part2 || '',
            part3: data.mathematics?.part3 || '',
            part4: data.mathematics?.part4 || ''
          },
          statistics: {
            part1: data.statistics?.part1 || '',
            part2: data.statistics?.part2 || '',
            part3: data.statistics?.part3 || '',
            part4: data.statistics?.part4 || ''
          }
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const generateParts = (type: 'mathematics' | 'statistics') => [
    {
      id: 1,
      title: `${type === 'mathematics' ? 'Mathematics' : 'Statistics'} Part 1`,
      driveLink: links[type].part1,
      resources: ['Past Questions', 'Lecture Notes', 'Tutorials', 'Reference Materials']
    },
    {
      id: 2,
      title: `${type === 'mathematics' ? 'Mathematics' : 'Statistics'} Part 2`,
      driveLink: links[type].part2,
      resources: ['Past Questions', 'Lecture Notes', 'Tutorials', 'Reference Materials']
    },
    {
      id: 3,
      title: `${type === 'mathematics' ? 'Mathematics' : 'Statistics'} Part 3`,
      driveLink: links[type].part3,
      resources: ['Past Questions', 'Lecture Notes', 'Tutorials', 'Reference Materials']
    },
    {
      id: 4,
      title: `${type === 'mathematics' ? 'Mathematics' : 'Statistics'} Part 4`,
      driveLink: links[type].part4,
      resources: ['Past Questions', 'Lecture Notes', 'Tutorials', 'Reference Materials']
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Academic Resources</h1>
            <p className="text-lg text-gray-600">
              Access comprehensive study materials, past questions, and tutorials organized by academic parts
            </p>
          </div>
        </div>
      </section>

      {/* Academic Parts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {/* Mathematics Section */}
            <div>
              <h2 className="text-2xl font-bold text-center mb-8">Mathematics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {generateParts('mathematics').map((part) => (
                  <Card key={part.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="text-center">
                      <FolderOpen className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                      <CardTitle className="text-2xl">{part.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-gray-700">Available Resources:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {part.resources.map((resource, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <Download className="h-3 w-3" />
                              <span>{resource}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => window.open(part.driveLink, '_blank')}
                        disabled={!part.driveLink}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Access Google Drive
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Statistics Section */}
            <div>
              <h2 className="text-2xl font-bold text-center mb-8">Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {generateParts('statistics').map((part) => (
                  <Card key={part.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="text-center">
                      <FolderOpen className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                      <CardTitle className="text-2xl">{part.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-gray-700">Available Resources:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {part.resources.map((resource, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <Download className="h-3 w-3" />
                              <span>{resource}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => window.open(part.driveLink, '_blank')}
                        disabled={!part.driveLink}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Access Google Drive
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}