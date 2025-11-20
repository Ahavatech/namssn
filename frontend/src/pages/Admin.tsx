// Admin.tsx - Fixed Version
import React, { useEffect, useState } from "react";
import { academicAPI, authAPI, eventsAPI, newsletterAPI } from "@/lib/api";
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
  DialogTitle,
  DialogDescription,
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
  FolderOpen,
  Save,
  Edit3,
  Trash2,
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
  status?: string;
};

type GalleryItem = {
  _id?: string;
  id?: string | number;
  type: string;
  title: string;
  description?: string;
};

type Newsletter = {
  id: string | number;
  title: string;
  description: string;
  date: string;
  filename: string;
  uploadDate: string;
  fileUrl?: string;
};

export default function Admin() {
  // --------- Auth/Login state -------------
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
    role: "",
  });
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

  // Event edit/delete dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editEventData, setEditEventData] = useState({
    _id: "",
    title: "",
    date: "",
    time: "",
    location: "",
    category: "",
    description: "",
  });
  const [newsletterDeleteDialogOpen, setNewsletterDeleteDialogOpen] = useState(false);
  const [eventDeleteDialogOpen, setEventDeleteDialogOpen] = useState(false);
  const [deleteEventData, setDeleteEventData] = useState<EventItem | null>(null);

  // --------- Gallery Management State ---------
  const [selectedGalleryEvent, setSelectedGalleryEvent] = useState("");
  const [galleryForm, setGalleryForm] = useState({
    title: "",
    description: "",
    type: "image",
    file: null as File | null,
  });
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryMessage, setGalleryMessage] = useState("");
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryCounts, setGalleryCounts] = useState({ images: 0, videos: 0 });

  // --------- Article Management (Admin only) ---------
  const [articles, setArticles] = useState<any[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [createStep, setCreateStep] = useState(0);
  const [articleSubmitting, setArticleSubmitting] = useState(false);
  const [articleForm, setArticleForm] = useState({
    topic: '',
    author: '',
    category: '',
    cover: null as File | null,
    body: ''
  });
  const categoriesList = [
    'Mathematics',
    'Applied Mathematics',
    'Statistics & Data Science',
    'Research & Innovation',
    'Opinion & Editorials',
    'Career & Development',
    'Campus & Culture'
  ];
  const [editingId, setEditingId] = useState<number | null>(null);

  const resetArticleForm = () => {
    setArticleForm({ topic: '', author: '', category: '', cover: null, body: '' });
    setCreateStep(0);
    setEditingId(null);
  };

  const handleCreateNext = () => setCreateStep((s) => Math.min(s + 1, 2));
  const handleCreateBack = () => setCreateStep((s) => Math.max(s - 1, 0));

  const handleCreateSubmit = async () => {
    // Create or update article via backend
    console.log('[Admin] handleCreateSubmit called', { editingId, articleForm });
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://namssnapi.onrender.com/api';
        const token = localStorage.getItem('token');
        const fetchForm = new FormData();
        fetchForm.append('title', articleForm.topic);
        fetchForm.append('content', articleForm.body);
        fetchForm.append('excerpt', articleForm.body.slice(0, 200));
        fetchForm.append('author', articleForm.author);
        fetchForm.append('category', articleForm.category);
        fetchForm.append('status', 'published');
        if (articleForm.cover) fetchForm.append('featuredImage', articleForm.cover);

        setArticleSubmitting(true);

        if (editingId) {
          console.log('[Admin] fetch PUT /articles', editingId);
          const res = await fetch(`${apiUrl}/articles/${editingId}`, {
            method: 'PUT',
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            body: fetchForm as unknown as BodyInit,
          });
          if (!res.ok) throw new Error('Failed to update article');
          const updated = await res.json();
          console.log('[Admin] article updated', updated);
          await loadArticles();
        } else {
          console.log('[Admin] fetch POST /articles');
          const res = await fetch(`${apiUrl}/articles`, {
            method: 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            body: fetchForm as unknown as BodyInit,
          });
          if (!res.ok) throw new Error('Failed to create article');
          const created = await res.json();
          console.log('[Admin] article created', created);
          await loadArticles();
        }

      resetArticleForm();
      setCreateOpen(false);
    } catch (err: any) {
      console.error('[Admin] handleCreateSubmit error', err);
      // If the error was a timeout, attempt a direct fetch as a fallback test to rule out Axios/config issues
      if (err?.message === 'request-timeout') {
        try {
          console.log('[Admin] request timed out, attempting fetch fallback');
          const apiUrl = import.meta.env.VITE_API_URL || 'https://namssnapi.onrender.com/api';
          const token = localStorage.getItem('token');
          const fallbackForm = new FormData();
          fallbackForm.append('title', articleForm.topic);
          fallbackForm.append('content', articleForm.body);
          fallbackForm.append('excerpt', articleForm.body.slice(0, 200));
          fallbackForm.append('author', articleForm.author);
          fallbackForm.append('category', articleForm.category);
          fallbackForm.append('status', 'published');
          if (articleForm.cover) fallbackForm.append('featuredImage', articleForm.cover);

          const fetchRes = await fetch(`${apiUrl}/articles${editingId ? '/' + String(editingId) : ''}`, {
            method: editingId ? 'PUT' : 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            body: fallbackForm as unknown as BodyInit,
          });
          const fetchData = await fetchRes.json();
          console.log('[Admin] fetch fallback response', fetchRes.status, fetchData);
          if (fetchRes.ok) {
            if (editingId) setArticles((prev) => prev.map(a => (a._id === fetchData._id || a.id === fetchData._id || a.id === editingId) ? fetchData : a));
            else setArticles((prev) => [fetchData, ...prev]);
            resetArticleForm();
            setCreateOpen(false);
            setArticleSubmitting(false);
            return;
          } else {
            alert('Fallback fetch failed: ' + (fetchData?.message || fetchRes.status));
          }
        } catch (fetchErr) {
          console.error('[Admin] fetch fallback error', fetchErr);
          alert('Network error during fallback: ' + (fetchErr as any)?.message);
        }
      } else {
        alert(err?.response?.data?.message || err?.message || 'Failed to save article');
      }
    } finally {
      // restore state
      setCreateStep(0);
      setArticleSubmitting(false);
    }
  };

  const handleEditArticle = (article: any) => {
    setEditingId(article._id || article.id || null);
    setArticleForm({ topic: article.title || article.topic || '', author: article.author || '', category: article.category || '', cover: null, body: article.content || article.body || '' });
    setCreateOpen(true);
  };

  const handleDeleteArticle = async (id: number | string) => {
    if (!confirm('Delete this article?')) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://namssnapi.onrender.com/api';
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/articles/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error('Failed to delete article');
      await loadArticles();
    } catch (err: any) {
      alert(err?.message || 'Failed to delete article');
    }
  };

  const loadArticles = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://namssnapi.onrender.com/api';
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/articles`, { headers: token ? { Authorization: `Bearer ${token}` } : undefined });
      if (!res.ok) throw new Error('Failed to load articles');
      const data = await res.json();
      const list = data.articles || data || [];
      setArticles(list);
    } catch (err) {
      console.error('Failed to load articles', err);
    }
  };

  // --------- Newsletters state -------------
  // Start with any saved newsletters in localStorage, but default to an empty list.
  // We'll populate this from the server when the component mounts.
  const [uploadedNewsletters, setUploadedNewsletters] = useState<Newsletter[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("newsletters");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed;
        } catch {}
      }
    }
    return [];
  });
  const [saveMessage, setSaveMessage] = useState<string>("");
  const [newsletterToDelete, setNewsletterToDelete] = useState<string | number | null>(null);
  // Fetch server newsletters on mount and update local state
  useEffect(() => {
    let mounted = true;
    const fetchServerNewsletters = async () => {
      try {
        const data = await newsletterAPI.getAll();
        const rawList = Array.isArray(data) ? data : data.newsletters || data.data || [];
        const list: Newsletter[] = rawList.map((item: any, idx: number) => ({
          id: item._id || item.id || idx,
          title: item.title || item.name || '',
          description: item.description || item.summary || '',
          date: item.publishDate ? new Date(item.publishDate).toISOString().split('T')[0] : (item.date || item.uploadDate || ''),
          filename: item.filename || (item.pdfUrl ? item.pdfUrl.split('/').pop() || '' : ''),
          uploadDate: item.uploadDate || item.publishDate || '',
          fileUrl: item.pdfUrl || item.fileUrl || item.pdf || undefined,
        }));
        if (!mounted) return;
        setUploadedNewsletters(list);
        try { localStorage.setItem('newsletters', JSON.stringify(list)); } catch {}
      } catch (err) {
        // keep any existing localStorage value or empty list
      }
    };
    fetchServerNewsletters();
    return () => { mounted = false };
  }, []);

  // --------- Drive links (Librarian) -------
  const [driveLinks, setDriveLinks] = useState({
    mathematics: {
      part1: "",
      part2: "",
      part3: "",
      part4: ""
    },
    statistics: {
      part1: "",
      part2: "",
      part3: "",
      part4: ""
    }
  });

  // ---------- Effects ----------
  useEffect(() => {
    // Initialize auth state from localStorage if present
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
    if (typeof window !== "undefined") {
      localStorage.setItem("newsletters", JSON.stringify(uploadedNewsletters));
    }
  }, [uploadedNewsletters]);

  // load articles when admin is present / on mount
  // Load drive links on mount if user is librarian
  useEffect(() => {
    const loadDriveLinks = async () => {
      if (userRole === "Librarian") {
        try {
          const data = await academicAPI.getLinks();
          setDriveLinks({
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
        } catch (err) {
          // Try to load from localStorage as fallback
          const savedLinks = localStorage.getItem("driveLinks");
          if (savedLinks) {
            try {
              setDriveLinks(JSON.parse(savedLinks));
            } catch {}
          }
        }
      }
    };
    loadDriveLinks();
  }, [userRole]);

  useEffect(() => {
    if (isLoggedIn) loadArticles();
  }, [isLoggedIn]);

  useEffect(() => {
    // Fetch events on mount
    const fetchEvents = async () => {
      setEventsLoading(true);
      setEventsError("");
      try {
        const data = await eventsAPI.getAll();
        setEvents(data.events || data);
      } catch (err: any) {
        setEventsError(err?.response?.data?.message || "Failed to fetch events");
      } finally {
        setEventsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Fetch gallery items for selected event
  useEffect(() => {
    async function fetchGallery() {
      if (!selectedGalleryEvent) {
        setGalleryItems([]);
        setGalleryCounts({ images: 0, videos: 0 });
        return;
      }
      try {
        const galleryAPI = await import("@/lib/api").then((m) => m.galleryAPI);
  const res = await galleryAPI.getAll({ eventId: selectedGalleryEvent });
        const items = res.items || res.data || [];
        setGalleryItems(items);
        setGalleryCounts({
          images: items.filter((i: GalleryItem) => i.type === "image").length,
          videos: items.filter((i: GalleryItem) => i.type === "video").length,
        });
      } catch {
        setGalleryItems([]);
        setGalleryCounts({ images: 0, videos: 0 });
      }
    }
    fetchGallery();
  }, [selectedGalleryEvent, galleryMessage]);

  // ---------- Event Handlers ----------
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

  const handleEventFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setEventForm((prev) => ({ ...prev, flyer: file }));
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setEventMessage("");
    if (!eventForm.title || !eventForm.date || !eventForm.time) {
      setEventMessage("Please provide title, date and time for the event.");
      return;
    }
    setEventLoading(true);
    try {
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
        const newEvent: EventItem = created?.event || created?.data || created;
        setEvents((prev) => [newEvent, ...prev]);
        setEventMessage("Event created successfully!");
      } else {
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

  const handleEditEvent = (event: EventItem) => {
    setEditEventData({
      _id: event._id || String(event.id),
      title: event.title || "",
      date: event.date || "",
      time: event.time || "",
      location: event.location || "",
      category: event.category || "",
      description: event.description || "",
    });
    setEditDialogOpen(true);
  };

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
      await eventsAPI.update(String(eventId), form);
      setEditDialogOpen(false);
      const data = await eventsAPI.getAll();
      setEvents(data.events || data);
    } catch (err: any) {
      setEventMessage(err?.response?.data?.message || "Failed to update event");
    }
  };

  const handleDeleteEvent = (event: EventItem) => {
  setDeleteEventData(event);
  setEventDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteEventData) return;
    try {
      await eventsAPI.delete(deleteEventData._id || String(deleteEventData.id));
  setEventDeleteDialogOpen(false);
      const data = await eventsAPI.getAll();
      setEvents(data.events || data);
    } catch (err: any) {
      setEventMessage(err?.response?.data?.message || "Failed to delete event");
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

  const handleGalleryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setGalleryForm((prev) => ({ ...prev, file: null }));
      return;
    }

    const MAX_BYTES = 10 * 1024 * 1024; // 10MB Cloudinary limit

    const isImage = file.type.startsWith('image/');

    const compressImage = async (input: File): Promise<File | null> => {
      try {
        const url = URL.createObjectURL(input);
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = reject;
          image.src = url;
        });

        // target max width/height
        const MAX_DIM = 1600;
        let { width, height } = img;
        let scale = 1;
        if (width > MAX_DIM || height > MAX_DIM) {
          scale = Math.min(MAX_DIM / width, MAX_DIM / height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;
        ctx.drawImage(img, 0, 0, width, height);

        // try to compress with decreasing quality until below MAX_BYTES or minQuality
        let quality = 0.85;
        const minQuality = 0.5;
        while (quality >= minQuality) {
          const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', quality));
          if (!blob) break;
          if (blob.size <= MAX_BYTES) {
            const newFile = new File([blob], input.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' });
            URL.revokeObjectURL(url);
            return newFile;
          }
          quality -= 0.1;
        }

        // final attempt: return last blob even if larger
        const finalBlob: Blob | null = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', minQuality));
        if (finalBlob) {
          const newFile = new File([finalBlob], input.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' });
          URL.revokeObjectURL(url);
          return newFile.size <= MAX_BYTES ? newFile : null;
        }
        URL.revokeObjectURL(url);
        return null;
      } catch (err) {
        return null;
      }
    };

    (async () => {
      if (file.size <= MAX_BYTES) {
        setGalleryForm((prev) => ({ ...prev, file }));
        return;
      }

      if (isImage) {
        setGalleryMessage('File is large; attempting to compress image...');
        const compressed = await compressImage(file);
        if (compressed) {
          setGalleryForm((prev) => ({ ...prev, file: compressed }));
          setGalleryMessage('Image compressed and ready for upload');
          setTimeout(() => setGalleryMessage(''), 3000);
          return;
        }
        setGalleryMessage('Image is too large even after compression. Please upload a smaller file (under 10MB).');
        setGalleryForm((prev) => ({ ...prev, file: null }));
        setTimeout(() => setGalleryMessage(''), 5000);
        return;
      }

      setGalleryMessage('File is too large. Maximum allowed size is 10MB.');
      setGalleryForm((prev) => ({ ...prev, file: null }));
      setTimeout(() => setGalleryMessage(''), 4000);
    })();
  };

  const handleGalleryUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setGalleryMessage("");
    if (!selectedGalleryEvent) {
      setGalleryMessage("Please select a past event.");
      return;
    }
    if (!galleryForm.title || !galleryForm.type || !galleryForm.file) {
      setGalleryMessage("Please fill all required fields and select a file.");
      return;
    }
    setGalleryLoading(true);
    try {
      const form = new FormData();
      form.append("title", galleryForm.title);
      form.append("description", galleryForm.description);
      form.append("type", galleryForm.type);
      form.append("category", "events");
      form.append("eventId", selectedGalleryEvent);
      form.append("media", galleryForm.file);
      const galleryAPI = await import("@/lib/api").then((m) => m.galleryAPI);
      await galleryAPI.upload(form);
      setGalleryMessage("Media uploaded successfully!");
      setGalleryForm({ title: "", description: "", type: "image", file: null });
      setSelectedGalleryEvent("");
    } catch (err: any) {
      setGalleryMessage(err?.response?.data?.message || "Failed to upload media");
    } finally {
      setGalleryLoading(false);
      setTimeout(() => setGalleryMessage(""), 4000);
    }
  };

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setNewsletterForm((prev) => ({ ...prev, file }));
  };

  const handleNewsletterUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterForm.title || !newsletterForm.description || !newsletterForm.date || !newsletterForm.file) {
      setSaveMessage("Please fill in all newsletter fields and select a PDF file");
      return;
    }
    try {
      // Upload PDF to backend, not Cloudinary
      const formData = new FormData();
      formData.append("title", newsletterForm.title);
      formData.append("description", newsletterForm.description);
      formData.append("date", newsletterForm.date);
      formData.append("pdf", newsletterForm.file!);
      // You may need to add other fields as required by your backend
      const apiUrl = import.meta.env.VITE_API_URL || "https://namssnapi.onrender.com/api";
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/newsletters`, {
        method: "POST",
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to upload newsletter PDF");
      const data = await res.json();
      // Expect backend to return newsletter object with Cloudinary URL
      // Derive filename: prefer backend-provided filename, else use provided file name, else extract from pdfUrl
      const derivedFilename = data.filename || newsletterForm.file?.name || (data.pdfUrl ? data.pdfUrl.split('/').pop() : undefined) || '';
      const newNewsletter: Newsletter = {
        id: data.id || uploadedNewsletters.length + 1,
        title: data.title,
        description: data.description,
        date: data.date,
        filename: derivedFilename,
        uploadDate: data.uploadDate || new Date().toISOString().split("T")[0],
        fileUrl: data.pdfUrl,
      };
      setUploadedNewsletters((prev) => [newNewsletter, ...prev]);
      setNewsletterForm({ title: "", description: "", date: "", file: null });
      setSaveMessage("Newsletter uploaded and added to archive!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err: any) {
      setSaveMessage(err?.message || "Failed to upload newsletter PDF");
    }
  };

  // Confirmation dialog state for newsletter delete
  // Remove duplicate declaration here, keep only the one near newsletter logic

  const confirmDeleteNewsletter = (id: string | number) => {
    setNewsletterToDelete(id);
    setNewsletterDeleteDialogOpen(true);
  };

  const handleDeleteNewsletter = async () => {
    if (newsletterToDelete === null) return;
    try {
      // Attempt server delete
      await fetch(`${import.meta.env.VITE_API_URL || 'https://namssnapi.onrender.com/api'}/newsletters/${newsletterToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '',
        },
      });
      // Remove from local state only after success
      setUploadedNewsletters((prev) => prev.filter((n) => n.id !== newsletterToDelete));
      setSaveMessage('Newsletter deleted successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
      setNewsletterToDelete(null);
      setNewsletterDeleteDialogOpen(false);
    } catch (err: any) {
      setSaveMessage(err?.message || 'Failed to delete newsletter');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handleSaveLinks = async () => {
    try {
      // Save to backend
      await academicAPI.updateLinks(driveLinks);
      // Save to local storage
      localStorage.setItem("driveLinks", JSON.stringify(driveLinks));
      // Show success message
      setSaveMessage("Drive links updated successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      setSaveMessage("Failed to update drive links. Please try again.");
      setTimeout(() => setSaveMessage(""), 5000);
    }
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
        {saveMessage && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{saveMessage}</AlertDescription>
          </Alert>
        )}

        {/* EIC Dashboard */}
        {userRole === "EIC" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

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
                  <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => { resetArticleForm(); setCreateOpen(true); }}>
                        <Upload className="mr-2 h-4 w-4" /> Create New Article
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingId ? 'Edit Article' : 'Create New Article'}</DialogTitle>
                        <DialogDescription>Step {createStep + 1} of 3</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-2">
                        {createStep === 0 && (
                          <div className="space-y-2">
                            <Label>Topic</Label>
                            <Input value={articleForm.topic} onChange={(e) => setArticleForm({ ...articleForm, topic: e.target.value })} />
                            <Label>Author</Label>
                            <Input value={articleForm.author} onChange={(e) => setArticleForm({ ...articleForm, author: e.target.value })} />
                            <Label>Category</Label>
                            <Select value={articleForm.category} onValueChange={(val) => setArticleForm({ ...articleForm, category: val })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categoriesList.map((c) => (
                                  <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {createStep === 1 && (
                          <div className="space-y-2">
                            <Label>Cover Image (optional)</Label>
                            <Input type="file" accept="image/*" onChange={(e) => setArticleForm({ ...articleForm, cover: e.target.files?.[0] ?? null })} />
                            {articleForm.cover && <img src={URL.createObjectURL(articleForm.cover)} alt="preview" className="mt-2 max-h-40" />}
                          </div>
                        )}

                        {createStep === 2 && (
                          <div className="space-y-2">
                            <Label>Article Body</Label>
                            <Textarea value={articleForm.body} onChange={(e) => setArticleForm({ ...articleForm, body: e.target.value })} rows={8} />
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        {createStep > 0 && <Button variant="outline" onClick={handleCreateBack}>Back</Button>}
                        {createStep < 2 && <Button onClick={handleCreateNext}>{createStep === 1 ? 'Skip/Next' : 'Next'}</Button>}
                        {createStep === 2 && (
                          <Button onClick={async () => { console.log('[Admin] Publish button clicked'); await handleCreateSubmit(); }} disabled={articleSubmitting}>
                            {editingId ? 'Update & Publish' : 'Publish'}
                          </Button>
                        )}
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => setViewOpen(true)}>
                        <BookOpen className="mr-2 h-4 w-4" /> View / Edit Articles
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>All Articles</DialogTitle>
                        <DialogDescription>Click edit to modify an article or delete to remove it.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-2 py-2">
                        {articles.length === 0 ? (
                          <p>No articles yet.</p>
                        ) : (
                          <ul className="space-y-2">
                            {articles.map(a => (
                              <li key={a.id} className="flex items-center justify-between border rounded px-3 py-2">
                                <div>
                                  <div className="font-medium">{a.topic}</div>
                                  <div className="text-xs text-gray-500">{a.author} • {a.category}</div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button title="Edit" onClick={() => { handleEditArticle(a); setViewOpen(false); }} className="text-blue-600 hover:text-blue-800"><Edit3 /></button>
                                  <button title="Delete" onClick={() => handleDeleteArticle(a._id)} className="text-red-600 hover:text-red-800"><Trash2 /></button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

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
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newsletter-date">Publication Date</Label>
                      <Input
                        id="newsletter-date"
                        type="date"
                        value={newsletterForm.date}
                        onChange={(e) => setNewsletterForm({ ...newsletterForm, date: e.target.value })}
                        required
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
                      required
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
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={newsletterForm.file === null || !newsletterForm.title || !newsletterForm.description || !newsletterForm.date}>
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                              const apiUrl = import.meta.env.VITE_API_URL || "https://namssnapi.onrender.com/api";
                              const apiOrigin = apiUrl.replace(/\/api\/?$/, '');
                              const token = localStorage.getItem("token");
                              try {
                                if (newsletter.filename) {
                                  try { await fetch(`${apiUrl}/newsletters/${newsletter.id}/download`, { method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {} }); } catch {}
                                  window.open(`${apiOrigin}/api/newsletters/public/${encodeURIComponent(newsletter.filename)}`, '_blank');
                                  return;
                                }
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
                          Preview
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => confirmDeleteNewsletter(newsletter.id)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                  {/* Newsletter Delete Confirmation Dialog */}
                  <Dialog open={newsletterDeleteDialogOpen} onOpenChange={setNewsletterDeleteDialogOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Newsletter?</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this newsletter? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setNewsletterDeleteDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteNewsletter}>Delete</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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

                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Archive Past Events
                  </Button>

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
                        {events.map((event) => (
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

                  <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <span className="text-lg font-bold">Edit Event</span>
                      </DialogHeader>
                      <form onSubmit={handleUpdateEvent} className="space-y-4">
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

                  <Dialog open={eventDeleteDialogOpen} onOpenChange={setEventDeleteDialogOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <span className="text-lg font-bold text-red-600">Delete Event</span>
                      </DialogHeader>
                      <div className="mb-4">Are you sure you want to delete <span className="font-semibold">{deleteEventData?.title}</span>?</div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setEventDeleteDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleConfirmDelete}>Delete</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
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
                <form onSubmit={handleGalleryUpload} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="gallery-event">Select Past Event</Label>
                    <select
                      id="gallery-event"
                      className="w-full border rounded px-2 py-1"
                      value={selectedGalleryEvent}
                      onChange={e => {
                        setSelectedGalleryEvent(e.target.value);
                        const event = events.find(ev => (ev._id || ev.id) === e.target.value);
                        if (event) {
                          setGalleryForm({
                            ...galleryForm,
                            title: event.title,
                            description: event.description || ""
                          });
                        } else {
                          setGalleryForm({ ...galleryForm, title: "", description: "" });
                        }
                      }}
                      title="Select Past Event"
                    >
                      <option value="">-- Select --</option>
                      {events
                        .filter(ev => {
                          const today = "2025-10-06";
                          return (ev.date && ev.date < today) || ev.status === 'completed';
                        })
                        .map(ev => (
                          <option key={ev._id || ev.id} value={ev._id || ev.id}>
                            {ev.title} ({ev.date})
                          </option>
                        ))}
                    </select>
                  </div>
                  {selectedGalleryEvent && (
                    <div className="flex items-center space-x-4 mb-2">
                      <span className="text-sm text-gray-600">Images: {galleryCounts.images}/10</span>
                      <span className="text-sm text-gray-600">Videos: {galleryCounts.videos}/2</span>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="gallery-title">Title</Label>
                    <Input
                      id="gallery-title"
                      value={galleryForm.title}
                      disabled={!!selectedGalleryEvent}
                      onChange={e => setGalleryForm({ ...galleryForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gallery-description">Description</Label>
                    <Textarea
                      id="gallery-description"
                      value={galleryForm.description}
                      disabled={!!selectedGalleryEvent}
                      onChange={e => setGalleryForm({ ...galleryForm, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gallery-type">Media Type</Label>
                    <select
                      id="gallery-type"
                      className="w-full border rounded px-2 py-1"
                      value={galleryForm.type}
                      onChange={e => setGalleryForm({ ...galleryForm, type: e.target.value })}
                      disabled={galleryCounts.images >= 10 && galleryForm.type === "image" || galleryCounts.videos >= 2 && galleryForm.type === "video"}
                      title="Select Media Type"
                    >
                      <option value="image" disabled={galleryCounts.images >= 10}>Image</option>
                      <option value="video" disabled={galleryCounts.videos >= 2}>Video</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gallery-file">Upload File</Label>
                    <Input
                      id="gallery-file"
                      type="file"
                      accept={galleryForm.type === "image" ? "image/*" : "video/*"}
                      onChange={handleGalleryFileChange}
                      required
                      disabled={galleryCounts.images >= 10 && galleryForm.type === "image" || galleryCounts.videos >= 2 && galleryForm.type === "video"}
                    />
                  </div>
                  {galleryMessage && (
                    <Alert className="mb-2">
                      <AlertDescription>{galleryMessage}</AlertDescription>
                    </Alert>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-pink-600 hover:bg-pink-700"
                    disabled={galleryLoading || (galleryCounts.images >= 10 && galleryForm.type === "image") || (galleryCounts.videos >= 2 && galleryForm.type === "video")}
                  >
                    {galleryLoading ? "Uploading..." : "Upload Media"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Change Password (replacement in small slot) */}
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
                    {pwLoading ? "Changing..." : "Change Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Librarian Dashboard */}
        {userRole === "Librarian" && (
          <div className="max-w-4xl mx-auto space-y-6">
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
              <p className="text-gray-600">Update Google Drive folder links for mathematics and statistics resources</p>
              {saveMessage && (
                <Alert className="mt-4">
                  <AlertDescription>{saveMessage}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Mathematics Section */}
            <div className="mb-12">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Mathematics Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FolderOpen className="h-5 w-5 text-blue-600" />
                      <span>Mathematics Part 1</span>
                    </CardTitle>
                    <CardDescription>100 Level mathematics courses and materials</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="math-part1-link">Google Drive Folder Link</Label>
                      <Input
                        id="math-part1-link"
                        type="url"
                        value={driveLinks.mathematics.part1}
                        onChange={(e) => setDriveLinks({
                          ...driveLinks,
                          mathematics: { ...driveLinks.mathematics, part1: e.target.value }
                        })}
                        placeholder="https://drive.google.com/drive/folders/..."
                      />
                    </div>
                    <Button type="button" onClick={handleSaveLinks} className="w-full bg-blue-600 hover:bg-blue-700" size="sm">
                      <Save className="mr-2 h-4 w-4" />
                      Update Mathematics Part 1
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FolderOpen className="h-5 w-5 text-green-600" />
                      <span>Mathematics Part 2</span>
                    </CardTitle>
                    <CardDescription>200 Level mathematics courses and materials</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="math-part2-link">Google Drive Folder Link</Label>
                      <Input
                        id="math-part2-link"
                        type="url"
                        value={driveLinks.mathematics.part2}
                        onChange={(e) => setDriveLinks({
                          ...driveLinks,
                          mathematics: { ...driveLinks.mathematics, part2: e.target.value }
                        })}
                        placeholder="https://drive.google.com/drive/folders/..."
                      />
                    </div>
                    <Button type="button" onClick={handleSaveLinks} className="w-full bg-green-600 hover:bg-green-700" size="sm">
                      <Save className="mr-2 h-4 w-4" />
                      Update Mathematics Part 2
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FolderOpen className="h-5 w-5 text-purple-600" />
                      <span>Mathematics Part 3</span>
                    </CardTitle>
                    <CardDescription>300 Level mathematics courses and materials</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="math-part3-link">Google Drive Folder Link</Label>
                      <Input
                        id="math-part3-link"
                        type="url"
                        value={driveLinks.mathematics.part3}
                        onChange={(e) => setDriveLinks({
                          ...driveLinks,
                          mathematics: { ...driveLinks.mathematics, part3: e.target.value }
                        })}
                        placeholder="https://drive.google.com/drive/folders/..."
                      />
                    </div>
                    <Button type="button" onClick={handleSaveLinks} className="w-full bg-purple-600 hover:bg-purple-700" size="sm">
                      <Save className="mr-2 h-4 w-4" />
                      Update Mathematics Part 3
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FolderOpen className="h-5 w-5 text-orange-600" />
                      <span>Mathematics Part 4</span>
                    </CardTitle>
                    <CardDescription>400 Level mathematics courses and materials</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="math-part4-link">Google Drive Folder Link</Label>
                      <Input
                        id="math-part4-link"
                        type="url"
                        value={driveLinks.mathematics.part4}
                        onChange={(e) => setDriveLinks({
                          ...driveLinks,
                          mathematics: { ...driveLinks.mathematics, part4: e.target.value }
                        })}
                        placeholder="https://drive.google.com/drive/folders/..."
                      />
                    </div>
                    <Button type="button" onClick={handleSaveLinks} className="w-full bg-orange-600 hover:bg-orange-700" size="sm">
                      <Save className="mr-2 h-4 w-4" />
                      Update Mathematics Part 4
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Statistics Section */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6">Statistics Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FolderOpen className="h-5 w-5 text-blue-600" />
                      <span>Statistics Part 1</span>
                    </CardTitle>
                    <CardDescription>100 Level statistics courses and materials</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="stats-part1-link">Google Drive Folder Link</Label>
                      <Input
                        id="stats-part1-link"
                        type="url"
                        value={driveLinks.statistics.part1}
                        onChange={(e) => setDriveLinks({
                          ...driveLinks,
                          statistics: { ...driveLinks.statistics, part1: e.target.value }
                        })}
                        placeholder="https://drive.google.com/drive/folders/..."
                      />
                    </div>
                    <Button type="button" onClick={handleSaveLinks} className="w-full bg-blue-600 hover:bg-blue-700" size="sm">
                      <Save className="mr-2 h-4 w-4" />
                      Update Statistics Part 1
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FolderOpen className="h-5 w-5 text-green-600" />
                      <span>Statistics Part 2</span>
                    </CardTitle>
                    <CardDescription>200 Level statistics courses and materials</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="stats-part2-link">Google Drive Folder Link</Label>
                      <Input
                        id="stats-part2-link"
                        type="url"
                        value={driveLinks.statistics.part2}
                        onChange={(e) => setDriveLinks({
                          ...driveLinks,
                          statistics: { ...driveLinks.statistics, part2: e.target.value }
                        })}
                        placeholder="https://drive.google.com/drive/folders/..."
                      />
                    </div>
                    <Button type="button" onClick={handleSaveLinks} className="w-full bg-green-600 hover:bg-green-700" size="sm">
                      <Save className="mr-2 h-4 w-4" />
                      Update Statistics Part 2
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FolderOpen className="h-5 w-5 text-purple-600" />
                      <span>Statistics Part 3</span>
                    </CardTitle>
                    <CardDescription>300 Level statistics courses and materials</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="stats-part3-link">Google Drive Folder Link</Label>
                      <Input
                        id="stats-part3-link"
                        type="url"
                        value={driveLinks.statistics.part3}
                        onChange={(e) => setDriveLinks({
                          ...driveLinks,
                          statistics: { ...driveLinks.statistics, part3: e.target.value }
                        })}
                        placeholder="https://drive.google.com/drive/folders/..."
                      />
                    </div>
                    <Button type="button" onClick={handleSaveLinks} className="w-full bg-purple-600 hover:bg-purple-700" size="sm">
                      <Save className="mr-2 h-4 w-4" />
                      Update Statistics Part 3
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FolderOpen className="h-5 w-5 text-orange-600" />
                      <span>Statistics Part 4</span>
                    </CardTitle>
                    <CardDescription>400 Level statistics courses and materials</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="stats-part4-link">Google Drive Folder Link</Label>
                      <Input
                        id="stats-part4-link"
                        type="url"
                        value={driveLinks.statistics.part4}
                        onChange={(e) => setDriveLinks({
                          ...driveLinks,
                          statistics: { ...driveLinks.statistics, part4: e.target.value }
                        })}
                        placeholder="https://drive.google.com/drive/folders/..."
                      />
                    </div>
                    <Button type="button" onClick={handleSaveLinks} className="w-full bg-orange-600 hover:bg-orange-700" size="sm">
                      <Save className="mr-2 h-4 w-4" />
                      Update Statistics Part 4
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}