import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Campaigns from "./pages/Campaigns";
import Organizations from "./pages/Organizations";
import Offerings from "./pages/Offerings";
import Personas from "./pages/Personas";
import Messages from "./pages/Messages";
import Images from "./pages/Images";
import Captions from "./pages/Captions";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

const TitleUpdater = () => {
  const location = useLocation();
  
  useEffect(() => {
    const path = location.pathname.substring(1);
    if (!path) {
      document.title = 'Home';
      return;
    }
    const title = path.charAt(0).toUpperCase() + path.slice(1);
    document.title = title;
  }, [location]);

  return null;
};

const AppRoutes = () => {
  return (
    <>
      <TitleUpdater />
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
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const queryClient = new QueryClient();

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
