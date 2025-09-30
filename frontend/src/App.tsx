import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import About from './pages/About';
import Academics from './pages/Academics';
import Editorial from './pages/Editorial';
import Contact from './pages/Contact';
import BookClub from './pages/BookClub';
import Events from './pages/Events';
import Newsletter from './pages/Newsletter';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/editorial" element={<Editorial />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/bookclub" element={<BookClub />} />
          <Route path="/events" element={<Events />} />
          <Route path="/newsletter" element={<Newsletter />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;