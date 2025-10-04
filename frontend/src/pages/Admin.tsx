// Admin.tsx
import React, { useEffect, useState } from "react";
import { academicAPI, authAPI, eventsAPI } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import {
  Shield,
  User,
  Lock,
  AlertCircle,
  Calendar,
  Camera,
  BookOpen,
  Mail,
  PenTool,
  Users,
  Link,
  FolderOpen,
  Save,
  Upload,
  FileText,
  Download,
} from "lucide-react";

type EventItem = {
  _id?: string;
  id?: string | number;
  title: string;
  date?: string;
  time?: string;
  location?: string;
  category?: string;
  description?: string;
  featuredImage?: string;
};

export default function Admin() {
  // --------- Auth/Login state -------------
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
    role: "",
  });
    // Event edit/delete dialog state
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editEventData, setEditEventData] = useState({
      _id: '',
      title: '',
      date: '',
      time: '',
      location: '',
      category: '',
      description: ''
    });
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteEventData, setDeleteEventData] = useState<any>(null);

    // Edit event handler
    const handleEditEvent = (event: any) => {
      setEditEventData({
        _id: event._id || event.id,
        title: event.title || '',
        date: event.date || '',
        time: event.time || '',
        location: event.location || '',
        category: event.category || '',
        description: event.description || ''
      });
      setEditDialogOpen(true);
    };

    // Update event handler
    const handleUpdateEvent = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
      const eventId = editEventData._id;
      const form = new FormData();
      form.append("title", editEventData.title);
      form.append("date", editEventData.date);
      form.append("time", editEventData.time);
      form.append("location", editEventData.location);
      form.append("category", editEventData.category);
      form.append("description", editEventData.description);
      // If you support flyer update, add: form.append("flyer", ...)
      await eventsAPI.update(eventId, form);
        setEditDialogOpen(false);
        // Optionally refetch events
        const data = await eventsAPI.getAll();
        setEvents(data.events || data);
      } catch (err) {
        // handle error
      }
    };

    // Delete event handler
    const handleDeleteEvent = (event: any) => {
      setDeleteEventData(event);
      setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
      try {
        await eventsAPI.delete(deleteEventData._id || deleteEventData.id);
        setDeleteDialogOpen(false);
        // Optionally refetch events
        const data = await eventsAPI.getAll();
        setEvents(data.events || data);
      } catch (err) {
        // handle error
      }
    };
  const [error, setError] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>("");

  // --------- Password change state ----------
  const [changePwForm, setChangePwForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [pwMessage, setPwMessage] = useState<string>("");
  const [pwLoading, setPwLoading] = useState<boolean>(false);

  // --------- Events state ---------------
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [eventForm, setEventForm] = useState<{
    title: string;
    date: string;
    time: string;
    location: string;
    category: string;
    description: string;
    flyer: File | null;
  }>({
    title: "",
    date: "",
    time: "",
    location: "",
    category: "",
    description: "",
    flyer: null,
  });
  const [eventMessage, setEventMessage] = useState<string>("");
  const [eventLoading, setEventLoading] = useState<boolean>(false);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventsLoading, setEventsLoading] = useState<boolean>(false);
  const [eventsError, setEventsError] = useState<string>("");

  // --------- Newsletters state -------------
  const [newsletterForm, setNewsletterForm] = useState<{
    title: string;
    description: string;
    date: string;
    file: File | null;
  }>({
    title: "",
    description: "",
    date: "",
    file: null,
  });
  const [uploadedNewsletters, setUploadedNewsletters] = useState<
    Array<{
      id: number;
      title: string;
      description: string;
      date: string;
      filename: string;
      uploadDate: string;
    }>
  >([
    {
      id: 1,
      title: "MATHEMA Newsletter - December 2024",
      description: "Year-end review, upcoming events, and student achievements",
      date: "2024-12-01",
      filename: "mathema-december-2024.pdf",
      uploadDate: "2024-12-01",
    },
    {
      id: 2,
      title: "MATHEMA Newsletter - November 2024",
      description:
        "Conference highlights, new research publications, and department news",
      date: "2024-11-01",
      filename: "mathema-november-2024.pdf",
      uploadDate: "2024-11-01",
    },
  ]);
  const [saveMessage, setSaveMessage] = useState<string>("");

  // --------- Drive links (Librarian) -------
  const [driveLinks, setDriveLinks] = useState({
    part1: "",
    part2: "",
    part3: "",
    part4: "",
  });

  // ---------- Effects ----------
  useEffect(() => {
    // initialize auth state from localStorage if present
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setIsLoggedIn(true);
        setUserRole(user.role || "");
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  useEffect(() => {
    // fetch events on mount
    const fetchEvents = async () => {
      setEventsLoading(true);
      setEventsError("");
      try {
        if (eventsAPI && typeof eventsAPI.getAll === "function") {
          const data = await eventsAPI.getAll();
          // support both { events: [...] } and direct array
          const list: EventItem[] = Array.isArray(data)
            ? data
            : data?.events || data?.data || [];
          setEvents(list);
        } else {
          // no backend — keep local events empty
          setEvents([]);
        }
      } catch (err) {
        setEventsError("Failed to fetch events");
      } finally {
        setEventsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // ---------- Handlers ----------

  const handleEventFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setEventForm((prev) => ({ ...prev, flyer: file }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setNewsletterForm((prev) => ({ ...prev, file }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (!authAPI || typeof authAPI.login !== "function") {
        throw new Error("authAPI.login not available");
      }
      const res = await authAPI.login({
        username: loginForm.username,
        password: loginForm.password,
        role: loginForm.role,
      });
      // expected shape: { token, user }
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      setIsLoggedIn(true);
      setUserRole(res.user.role || loginForm.role);
      setLoginForm({ username: "", password: "", role: "" });
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Login failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserRole("");
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setEventMessage("");
    // basic validation
    if (!eventForm.title || !eventForm.date || !eventForm.time) {
      setEventMessage("Please provide title, date and time for the event.");
      return;
    }
    setEventLoading(true);
    try {
      // If there's an eventsAPI.create that accepts FormData
      if (eventsAPI && typeof eventsAPI.create === "function") {
        const form = new FormData();
        form.append("title", eventForm.title);
        form.append("date", eventForm.date);
        form.append("time", eventForm.time);
        form.append("location", eventForm.location);
        form.append("category", eventForm.category);
        form.append("description", eventForm.description);
        if (eventForm.flyer) form.append("flyer", eventForm.flyer);

        const created = await eventsAPI.create(form);
        // assume created contains the new event
        const newEvent: EventItem = created?.event || created?.data || created;
        setEvents((prev) => [newEvent, ...prev]);
        setEventMessage("Event created successfully!");
      } else {
        // If no backend exists, simulate add locally
        const newEvent: EventItem = {
          id: String(Date.now()),
          title: eventForm.title,
          date: eventForm.date,
          time: eventForm.time,
          location: eventForm.location,
          category: eventForm.category,
          description: eventForm.description,
          featuredImage: eventForm.flyer ? URL.createObjectURL(eventForm.flyer) : undefined,
        };
        setEvents((prev) => [newEvent, ...prev]);
        setEventMessage("Event created locally (no backend).");
      }
      // reset form
      setEventForm({
        title: "",
        date: "",
        time: "",
        location: "",
        category: "",
        description: "",
        flyer: null,
      });
      setEventDialogOpen(false);
    } catch (err: any) {
      setEventMessage(err?.response?.data?.message || "Failed to create event");
    } finally {
      setEventLoading(false);
      setTimeout(() => setEventMessage(""), 4000);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMessage("");
    if (!changePwForm.oldPassword || !changePwForm.newPassword || !changePwForm.confirmNewPassword) {
      setPwMessage("Please fill all fields");
      return;
    }
    if (changePwForm.newPassword !== changePwForm.confirmNewPassword) {
      setPwMessage("New passwords do not match");
      return;
    }
    setPwLoading(true);
    try {
      // lazy import or call changePasswordAPI
      const { changePasswordAPI } = await import("@/lib/api");
      if (!changePasswordAPI || typeof changePasswordAPI.change !== "function") {
        throw new Error("changePassword API not available");
      }
      const res = await changePasswordAPI.change(changePwForm.oldPassword, changePwForm.newPassword);
      setPwMessage(res?.message || "Password changed successfully");
      setChangePwForm({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (err: any) {
      setPwMessage(err?.response?.data?.message || err?.message || "Failed to change password");
    } finally {
      setPwLoading(false);
      setTimeout(() => setPwMessage(""), 4000);
    }
  };

  const handleNewsletterUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterForm.title || !newsletterForm.description || !newsletterForm.date) {
      setSaveMessage("Please fill in all newsletter fields");
      return;
    }
    const newNewsletter = {
      id: uploadedNewsletters.length + 1,
      title: newsletterForm.title,
      description: newsletterForm.description,
      date: newsletterForm.date,
      filename: newsletterForm.file ? newsletterForm.file.name : "newsletter.pdf",
      uploadDate: new Date().toISOString().split("T")[0],
    };
    setUploadedNewsletters((prev) => [newNewsletter, ...prev]);
    setNewsletterForm({ title: "", description: "", date: "", file: null });
    setSaveMessage("Newsletter uploaded successfully and added to archive!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const deleteNewsletter = (id: number) => {
    setUploadedNewsletters((prev) => prev.filter((n) => n.id !== id));
    setSaveMessage("Newsletter deleted successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleSaveLinks = () => {
    // stubbed: you may want to call an API to persist these
    setSaveMessage("Drive links updated successfully!");
    // optional: persist to localStorage
    localStorage.setItem("driveLinks", JSON.stringify(driveLinks));
    setTimeout(() => setSaveMessage(""), 3000);
  };

  // ---------- Render ----------
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>Access the NAMSSN OAU admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={loginForm.role}
                  onValueChange={(value) => setLoginForm({ ...loginForm, role: value })}
                >
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
        {/* Global success message */}
        {saveMessage && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{saveMessage}</AlertDescription>
          </Alert>
        )}

        {/* EIC Dashboard */}
        {userRole === "EIC" && (
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
                    {pwLoading ? "Changing..." : "Change Password"}
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

            {/* Newsletter Upload */}
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
                        onChange={(e) => setNewsletterForm({ ...newsletterForm, title: e.target.value })}
                        placeholder="e.g., MATHEMA Newsletter - January 2025"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newsletter-date">Publication Date</Label>
                      <Input
                        id="newsletter-date"
                        type="date"
                        value={newsletterForm.date}
                        onChange={(e) => setNewsletterForm({ ...newsletterForm, date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newsletter-description">Description</Label>
                    <Textarea
                      id="newsletter-description"
                      value={newsletterForm.description}
                      onChange={(e) => setNewsletterForm({ ...newsletterForm, description: e.target.value })}
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

            {/* Newsletter Archive */}
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
                        <Button variant="destructive" size="sm" onClick={() => deleteNewsletter(newsletter.id)}>
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
                            onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="event-date">Date</Label>
                            <Input
                              id="event-date"
                              type="date"
                              value={eventForm.date}
                              onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="event-time">Time</Label>
                            <Input
                              id="event-time"
                              type="time"
                              value={eventForm.time}
                              onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="event-location">Location</Label>
                          <Input
                            id="event-location"
                            value={eventForm.location}
                            onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="event-category">Category</Label>
                          <Select value={eventForm.category} onValueChange={(value) => setEventForm({ ...eventForm, category: value })}>
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
                            onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
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
                            {eventLoading ? "Creating..." : "Create Event"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>

                  {/* Quick actions */}
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Archive Past Events
                  </Button>

                  {/* Event list with edit/delete actions */}
                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">All Events</h3>
                    {eventsLoading ? (
                      <p>Loading events...</p>
                    ) : eventsError ? (
                      <Alert variant="destructive"><AlertDescription>{eventsError}</AlertDescription></Alert>
                    ) : events.length === 0 ? (
                      <p>No events found.</p>
                    ) : (
                      <ul className="space-y-2">
                        {events.map((event: any) => (
                          <li key={event._id || event.id} className="flex items-center justify-between border rounded px-4 py-2">
                            <span className="font-medium text-gray-900">{event.title}</span>
                            <span className="flex items-center space-x-2">
                              <button
                                className="text-blue-600 hover:text-blue-800"
                                onClick={() => handleEditEvent(event)}
                                title="Edit"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm0 0V17h4" /></svg>
                              </button>
                              <button
                                className="text-red-600 hover:text-red-800"
                                onClick={() => handleDeleteEvent(event)}
                                title="Delete"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Edit Event Dialog */}
                  <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <span className="text-lg font-bold">Edit Event</span>
                      </DialogHeader>
                      <form onSubmit={handleUpdateEvent} className="space-y-4">
                        {/* Same fields as create, pre-filled with editEventData */}
                        <div className="space-y-2">
                          <Label htmlFor="edit-event-title">Title</Label>
                          <Input
                            id="edit-event-title"
                            value={editEventData.title}
                            onChange={e => setEditEventData({ ...editEventData, title: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-event-date">Date</Label>
                          <Input
                            id="edit-event-date"
                            type="date"
                            value={editEventData.date}
                            onChange={e => setEditEventData({ ...editEventData, date: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-event-time">Time</Label>
                          <Input
                            id="edit-event-time"
                            type="time"
                            value={editEventData.time}
                            onChange={e => setEditEventData({ ...editEventData, time: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-event-location">Location</Label>
                          <Input
                            id="edit-event-location"
                            value={editEventData.location}
                            onChange={e => setEditEventData({ ...editEventData, location: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-event-category">Category</Label>
                          <Input
                            id="edit-event-category"
                            value={editEventData.category}
                            onChange={e => setEditEventData({ ...editEventData, category: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-event-description">Description</Label>
                          <Textarea
                            id="edit-event-description"
                            value={editEventData.description}
                            onChange={e => setEditEventData({ ...editEventData, description: e.target.value })}
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                          Update Event
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  {/* Delete Confirmation Dialog */}
                  <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <span className="text-lg font-bold text-red-600">Delete Event</span>
                      </DialogHeader>
                      <div className="mb-4">Are you sure you want to delete <span className="font-semibold">{deleteEventData?.title}</span>?</div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleConfirmDelete}>Delete</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Gallery, Book Club, etc. (kept as buttons for now) */}
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
                </div>
              </CardContent>
            </Card>

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
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Librarian Dashboard */}
        {userRole === "Librarian" && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Change Password (same handler) */}
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
                    <Label htmlFor="oldPasswordL">Old Password</Label>
                    <Input
                      id="oldPasswordL"
                      type="password"
                      value={changePwForm.oldPassword}
                      onChange={(e) => setChangePwForm({ ...changePwForm, oldPassword: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPasswordL">New Password</Label>
                    <Input
                      id="newPasswordL"
                      type="password"
                      value={changePwForm.newPassword}
                      onChange={(e) => setChangePwForm({ ...changePwForm, newPassword: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmNewPasswordL">Confirm New Password</Label>
                    <Input
                      id="confirmNewPasswordL"
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
                    {pwLoading ? "Changing..." : "Change Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Google Drive Links Management</h2>
              <p className="text-gray-600">Update Google Drive folder links for each academic part</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Part 1 */}
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
                      onChange={(e) => setDriveLinks({ ...driveLinks, part1: e.target.value })}
                      placeholder="https://drive.google.com/drive/folders/..."
                    />
                  </div>
                  <Button type="button" onClick={handleSaveLinks} className="w-full bg-blue-600 hover:bg-blue-700" size="sm">
                    <Save className="mr-2 h-4 w-4" />
                    Update Part 1 Link
                  </Button>
                </CardContent>
              </Card>

              {/* Part 2 */}
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
                      onChange={(e) => setDriveLinks({ ...driveLinks, part2: e.target.value })}
                      placeholder="https://drive.google.com/drive/folders/..."
                    />
                  </div>
                  <Button type="button" onClick={handleSaveLinks} className="w-full bg-green-600 hover:bg-green-700" size="sm">
                    <Save className="mr-2 h-4 w-4" />
                    Update Part 2 Link
                  </Button>
                </CardContent>
              </Card>

              {/* Part 3 */}
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
                      onChange={(e) => setDriveLinks({ ...driveLinks, part3: e.target.value })}
                      placeholder="https://drive.google.com/drive/folders/..."
                    />
                  </div>
                  <Button type="button" onClick={handleSaveLinks} className="w-full bg-purple-600 hover:bg-purple-700" size="sm">
                    <Save className="mr-2 h-4 w-4" />
                    Update Part 3 Link
                  </Button>
                </CardContent>
              </Card>

              {/* Part 4 */}
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
                      onChange={(e) => setDriveLinks({ ...driveLinks, part4: e.target.value })}
                      placeholder="https://drive.google.com/drive/folders/..."
                    />
                  </div>
                  <Button type="button" onClick={handleSaveLinks} className="w-full bg-orange-600 hover:bg-orange-700" size="sm">
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
