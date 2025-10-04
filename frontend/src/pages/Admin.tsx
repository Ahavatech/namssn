import { useState, useEffect } from 'react';
import { academicAPI, authAPI } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Shield, User, Lock, AlertCircle, Calendar, Camera, BookOpen, Mail, PenTool, Users, Link, FolderOpen, Save, Upload, FileText, Download } from 'lucide-react';

export default function Admin() {
  // Event creation dialog state
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    category: 'academic',
    description: '',
    flyer: null
  });
  const [eventMessage, setEventMessage] = useState('');
  const [eventLoading, setEventLoading] = useState(false);

  const handleEventFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setEventForm({ ...eventForm, flyer: file });
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setEventMessage('');
    setEventLoading(true);
    try {
      const formData = new FormData();
  formData.append('title', eventForm.title);
  formData.append('date', eventForm.date);
  formData.append('time', eventForm.time);
  formData.append('location', eventForm.location);
  formData.append('category', eventForm.category);
  formData.append('description', eventForm.description);
  if (eventForm.flyer) formData.append('featuredImage', eventForm.flyer);
  await eventsAPI.create(formData);
  setEventMessage('Event created successfully!');
  setEventForm({ title: '', date: '', time: '', location: '', category: 'academic', description: '', flyer: null });
  setEventDialogOpen(false);
    } catch (err) {
      setEventMessage('Failed to create event');
    }
    setEventLoading(false);
    setTimeout(() => setEventMessage(''), 3000);
  };
  const handleSaveLinks = async () => {
    setSaveMessage('');
    setLoadingLinks(true);
    try {
      await academicAPI.updateLinks(driveLinks);
      setSaveMessage('Google Drive links updated successfully!');
    } catch (err) {
      setSaveMessage('Failed to update links');
    }
    setLoadingLinks(false);
    setTimeout(() => setSaveMessage(''), 3000);
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('');
    setLoginForm({ username: '', password: '', role: '' });
    setError('');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
    role: ''
  });
  // Change password state
  const [changePwForm, setChangePwForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [pwMessage, setPwMessage] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [error, setError] = useState('');
  const [driveLinks, setDriveLinks] = useState({
    part1: '',
    part2: '',
    part3: '',
    part4: ''
  });
  const [loadingLinks, setLoadingLinks] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  // Newsletter upload state
  const [newsletterForm, setNewsletterForm] = useState({
    title: '',
    description: '',
    date: '',
    file: null
  });
  const [uploadedNewsletters, setUploadedNewsletters] = useState([
    {
      id: 1,
      title: "MATHEMA Newsletter - December 2024",
      description: "Year-end review, upcoming events, and student achievements",
      date: "2024-12-01",
      filename: "mathema-december-2024.pdf",
      uploadDate: "2024-12-01"
    },
    {
      id: 2,
      title: "MATHEMA Newsletter - November 2024",
      description: "Conference highlights, new research publications, and department news",
      date: "2024-11-01",
      filename: "mathema-november-2024.pdf",
      uploadDate: "2024-11-01"
    }
  ]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await authAPI.login({
        username: loginForm.username,
        password: loginForm.password,
        role: loginForm.role
      });
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      setIsLoggedIn(true);
      setUserRole(res.user.role);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed');
    }
  };

    // Change password handler
    const handleChangePassword = async (e: React.FormEvent) => {
      e.preventDefault();
      setPwMessage('');
      if (!changePwForm.oldPassword || !changePwForm.newPassword || !changePwForm.confirmNewPassword) {
        setPwMessage('Please fill all fields');
        return;
      }
      if (changePwForm.newPassword !== changePwForm.confirmNewPassword) {
        setPwMessage('New passwords do not match');
        return;
      }
      setPwLoading(true);
      try {
        const { changePasswordAPI } = await import('@/lib/api');
        const res = await changePasswordAPI.change(changePwForm.oldPassword, changePwForm.newPassword);
        setPwMessage(res.message || 'Password changed successfully');
        setChangePwForm({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
      } catch (err: any) {
        setPwMessage(err?.response?.data?.message || 'Failed to change password');
      }
      setPwLoading(false);
      setTimeout(() => setPwMessage(''), 4000);
    };

  const handleNewsletterUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterForm.title || !newsletterForm.description || !newsletterForm.date) {
      setSaveMessage('Please fill in all newsletter fields');
      return;
    }
    const newNewsletter = {
      id: uploadedNewsletters.length + 1,
      title: newsletterForm.title,
      description: newsletterForm.description,
      date: newsletterForm.date,
      filename: newsletterForm.file ? newsletterForm.file.name : 'newsletter.pdf',
      uploadDate: new Date().toISOString().split('T')[0],
    };
    setUploadedNewsletters([newNewsletter, ...uploadedNewsletters]);
    setNewsletterForm({ title: '', description: '', date: '', file: null });
    setSaveMessage('Newsletter uploaded successfully and added to archive!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewsletterForm({ ...newsletterForm, file });
    }
  };

  const deleteNewsletter = (id: number) => {
    setUploadedNewsletters(uploadedNewsletters.filter(newsletter => newsletter.id !== id));
    setSaveMessage('Newsletter deleted successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>
              Access the NAMSSN OAU admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={loginForm.role} onValueChange={(value) => setLoginForm({...loginForm, role: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EIC">Editor-in-Chief (EIC)</SelectItem>
                    <SelectItem value="Librarian">Librarian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                <Lock className="mr-2 h-4 w-4" />
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-lg font-bold text-gray-900">NAMSSN Admin Panel</h1>
                <p className="text-sm text-gray-600">{userRole} Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">Welcome, {userRole}</span>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Success/Error Messages */}
        {saveMessage && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{saveMessage}</AlertDescription>
          </Alert>
        )}
        
        {/* EIC Dashboard */}
        {userRole === 'EIC' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Change Password */}
            <Card className="hover:shadow-md transition-shadow lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Lock className="h-5 w-5 text-red-600" />
                  <span>Change Password</span>
                </CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="oldPassword">Old Password</Label>
                    <Input
                      id="oldPassword"
                      type="password"
                      value={changePwForm.oldPassword}
                      onChange={(e) => setChangePwForm({ ...changePwForm, oldPassword: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={changePwForm.newPassword}
                      onChange={(e) => setChangePwForm({ ...changePwForm, newPassword: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                    <Input
                      id="confirmNewPassword"
                      type="password"
                      value={changePwForm.confirmNewPassword}
                      onChange={(e) => setChangePwForm({ ...changePwForm, confirmNewPassword: e.target.value })}
                      required
                    />
                  </div>
                  {pwMessage && (
                    <Alert className="mb-2">
                      <AlertDescription>{pwMessage}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={pwLoading}>
                    {pwLoading ? 'Changing...' : 'Change Password'}
                  </Button>
                </form>
              </CardContent>
            </Card>
            {/* Editorial Management */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <PenTool className="h-5 w-5 text-blue-600" />
                  <span>Editorial Management</span>
                </CardTitle>
                <CardDescription>Manage articles, publications, and editorial content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Create New Article
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Edit Existing Articles
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Manage Categories
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Review Submissions
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Publish/Unpublish Articles
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Upload Management */}
            <Card className="hover:shadow-md transition-shadow lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-green-600" />
                  <span>Newsletter Upload</span>
                </CardTitle>
                <CardDescription>Upload newsletter PDFs to make them available in the archive</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNewsletterUpload} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newsletter-title">Newsletter Title</Label>
                      <Input
                        id="newsletter-title"
                        value={newsletterForm.title}
                        onChange={(e) => setNewsletterForm({...newsletterForm, title: e.target.value})}
                        placeholder="e.g., MATHEMA Newsletter - January 2025"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newsletter-date">Publication Date</Label>
                      <Input
                        id="newsletter-date"
                        type="date"
                        value={newsletterForm.date}
                        onChange={(e) => setNewsletterForm({...newsletterForm, date: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newsletter-description">Description</Label>
                    <Textarea
                      id="newsletter-description"
                      value={newsletterForm.description}
                      onChange={(e) => setNewsletterForm({...newsletterForm, description: e.target.value})}
                      placeholder="Brief description of newsletter content..."
                      className="min-h-[80px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newsletter-file">Upload PDF File</Label>
                    <Input
                      id="newsletter-file"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Newsletter
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Newsletter Archive Management */}
            <Card className="hover:shadow-md transition-shadow lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <span>Newsletter Archive Management</span>
                </CardTitle>
                <CardDescription>Manage uploaded newsletters in the archive</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {uploadedNewsletters.map((newsletter) => (
                    <div key={newsletter.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{newsletter.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{newsletter.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                          <span>Published: {new Date(newsletter.date).toLocaleDateString()}</span>
                          <span>Uploaded: {new Date(newsletter.uploadDate).toLocaleDateString()}</span>
                          <span>File: {newsletter.filename}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteNewsletter(newsletter.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                  {uploadedNewsletters.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No newsletters uploaded yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Events Management */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <span>Events Management</span>
                </CardTitle>
                <CardDescription>Plan, organize, and manage all NAMSSN events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        Create New Event
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <span className="text-lg font-bold">Create New Event</span>
                      </DialogHeader>
                      <form onSubmit={handleCreateEvent} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="event-title">Title</Label>
                          <Input
                            id="event-title"
                            value={eventForm.title}
                            onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="event-date">Date</Label>
                          <Input
                            id="event-date"
                            type="date"
                            value={eventForm.date}
                            onChange={e => setEventForm({ ...eventForm, date: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="event-time">Time</Label>
                          <Input
                            id="event-time"
                            type="time"
                            value={eventForm.time}
                            onChange={e => setEventForm({ ...eventForm, time: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="event-location">Location</Label>
                          <Input
                            id="event-location"
                            value={eventForm.location}
                            onChange={e => setEventForm({ ...eventForm, location: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="event-category">Category</Label>
                          <Select value={eventForm.category} onValueChange={value => setEventForm({ ...eventForm, category: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="academic">Academic</SelectItem>
                              <SelectItem value="social">Social</SelectItem>
                              <SelectItem value="professional">Professional</SelectItem>
                              <SelectItem value="cultural">Cultural</SelectItem>
                              <SelectItem value="sports">Sports</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="event-description">Description</Label>
                          <Textarea
                            id="event-description"
                            value={eventForm.description}
                            onChange={e => setEventForm({ ...eventForm, description: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="event-flyer">Event Flyer (optional)</Label>
                          <Input
                            id="event-flyer"
                            type="file"
                            accept="image/*"
                            onChange={handleEventFileChange}
                          />
                        </div>
                        {eventMessage && (
                          <Alert className="mb-2">
                            <AlertDescription>{eventMessage}</AlertDescription>
                          </Alert>
                        )}
                        <DialogFooter>
                          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={eventLoading}>
                            {eventLoading ? 'Creating...' : 'Create Event'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Edit Upcoming Events
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Archive Past Events
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Gallery Management */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Camera className="h-5 w-5 text-pink-600" />
                  <span>Gallery Management</span>
                </CardTitle>
                <CardDescription>Upload and organize event photos and media</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Upload New Photos
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Organize Photo Albums
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Edit Photo Descriptions
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Manage Featured Photos
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Delete/Archive Photos
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Book Club Management */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-orange-600" />
                  <span>Book Club Management</span>
                </CardTitle>
                <CardDescription>Manage reading lists, discussions, and club activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Update Current Reading
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Manage Reading List
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Schedule Discussions
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Track Member Progress
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Book Recommendations
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Librarian Dashboard - Google Drive Links Management */}
        {userRole === 'Librarian' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Change Password */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Lock className="h-5 w-5 text-red-600" />
                  <span>Change Password</span>
                </CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="oldPassword">Old Password</Label>
                    <Input
                      id="oldPassword"
                      type="password"
                      value={changePwForm.oldPassword}
                      onChange={(e) => setChangePwForm({ ...changePwForm, oldPassword: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={changePwForm.newPassword}
                      onChange={(e) => setChangePwForm({ ...changePwForm, newPassword: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                    <Input
                      id="confirmNewPassword"
                      type="password"
                      value={changePwForm.confirmNewPassword}
                      onChange={(e) => setChangePwForm({ ...changePwForm, confirmNewPassword: e.target.value })}
                      required
                    />
                  </div>
                  {pwMessage && (
                    <Alert className="mb-2">
                      <AlertDescription>{pwMessage}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={pwLoading}>
                    {pwLoading ? 'Changing...' : 'Change Password'}
                  </Button>
                </form>
              </CardContent>
            </Card>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Google Drive Links Management</h2>
              <p className="text-gray-600">Update Google Drive folder links for each academic part</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Part 1 Resources */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FolderOpen className="h-5 w-5 text-blue-600" />
                    <span>Part 1 Resources</span>
                  </CardTitle>
                  <CardDescription>100 Level courses and materials</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="part1-link">Google Drive Folder Link</Label>
                    <Input
                      id="part1-link"
                      type="url"
                      value={driveLinks.part1}
                      onChange={(e) => setDriveLinks({...driveLinks, part1: e.target.value})}
                      placeholder="https://drive.google.com/drive/folders/..."
                    />
                  </div>
                  <Button 
                    type="button"
                    onClick={handleSaveLinks} 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="sm"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Update Part 1 Link
                  </Button>
                </CardContent>
              </Card>

              {/* Part 2 Resources */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FolderOpen className="h-5 w-5 text-green-600" />
                    <span>Part 2 Resources</span>
                  </CardTitle>
                  <CardDescription>200 Level courses and materials</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="part2-link">Google Drive Folder Link</Label>
                    <Input
                      id="part2-link"
                      type="url"
                      value={driveLinks.part2}
                      onChange={(e) => setDriveLinks({...driveLinks, part2: e.target.value})}
                      placeholder="https://drive.google.com/drive/folders/..."
                    />
                  </div>
                  <Button 
                    type="button"
                    onClick={handleSaveLinks} 
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Update Part 2 Link
                  </Button>
                </CardContent>
              </Card>

              {/* Part 3 Resources */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FolderOpen className="h-5 w-5 text-purple-600" />
                    <span>Part 3 Resources</span>
                  </CardTitle>
                  <CardDescription>300 Level courses and materials</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="part3-link">Google Drive Folder Link</Label>
                    <Input
                      id="part3-link"
                      type="url"
                      value={driveLinks.part3}
                      onChange={(e) => setDriveLinks({...driveLinks, part3: e.target.value})}
                      placeholder="https://drive.google.com/drive/folders/..."
                    />
                  </div>
                  <Button 
                    type="button"
                    onClick={handleSaveLinks} 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    size="sm"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Update Part 3 Link
                  </Button>
                </CardContent>
              </Card>

              {/* Part 4 Resources */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FolderOpen className="h-5 w-5 text-orange-600" />
                    <span>Part 4 Resources</span>
                  </CardTitle>
                  <CardDescription>400 Level courses and materials</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="part4-link">Google Drive Folder Link</Label>
                    <Input
                      id="part4-link"
                      type="url"
                      value={driveLinks.part4}
                      onChange={(e) => setDriveLinks({...driveLinks, part4: e.target.value})}
                      placeholder="https://drive.google.com/drive/folders/..."
                    />
                  </div>
                  <Button 
                    type="button"
                    onClick={handleSaveLinks} 
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    size="sm"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Update Part 4 Link
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}