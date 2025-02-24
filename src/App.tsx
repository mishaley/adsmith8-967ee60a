
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
