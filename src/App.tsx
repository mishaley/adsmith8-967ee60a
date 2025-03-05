
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Campaigns from "./pages/Campaigns";
import Organizations from "./pages/Organizations";
import Offerings from "./pages/Offerings";
import Personas from "./pages/Personas";
import Messages from "./pages/Messages";
import Images from "./pages/Images";
import Captions from "./pages/Captions";
import Settings from "./pages/Settings";
import New from "./pages/New";
import Intake from "./pages/Intake";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { saveToLocalStorage, loadFromLocalStorage, STORAGE_KEYS } from "./pages/Intake/utils/localStorageUtils";

// List of valid routes for our app
const VALID_ROUTES = [
  '/home',
  '/campaigns',
  '/organizations',
  '/offerings',
  '/personas',
  '/messages',
  '/images',
  '/captions',
  '/settings',
  '/new',
  '/intake'
];

const TitleUpdater = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Save current route to localStorage whenever it changes
    if (location.pathname !== '/' && location.pathname !== '/index') {
      saveToLocalStorage(STORAGE_KEYS.LAST_ROUTE, location.pathname);
    }

    const path = location.pathname.substring(1);
    if (!path || path === 'index') {
      document.title = 'Adsmith: Intake';
      return;
    }
    const title = path.charAt(0).toUpperCase() + path.slice(1);
    document.title = `Adsmith: ${title}`;
  }, [location]);

  return null;
};

const RouteRestorer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if we're exactly at the root path or /index
    if (location.pathname === '/' || location.pathname === '/index') {
      // Load last route from localStorage
      const lastRoute = loadFromLocalStorage<string>(STORAGE_KEYS.LAST_ROUTE, '/intake');
      
      // Validate that the route exists in our app
      const targetRoute = VALID_ROUTES.includes(lastRoute) ? lastRoute : '/intake';
      
      // Navigate to the last route - using REPLACE to avoid adding to history
      navigate(targetRoute, { replace: true });
    }
  // Only run this effect once on mount plus when location.pathname changes
  }, [location.pathname, navigate]);

  return null;
};

const AppRoutes = () => {
  return (
    <>
      <TitleUpdater />
      <RouteRestorer />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/organizations" element={<Organizations />} />
        <Route path="/offerings" element={<Offerings />} />
        <Route path="/personas" element={<Personas />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/images" element={<Images />} />
        <Route path="/captions" element={<Captions />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/new" element={<New />} />
        <Route path="/intake" element={<Intake />} />
        <Route path="/" element={<Navigate to="/intake" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevent refetching when window regains focus
      retry: 1, // Limit retries on failed queries
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
