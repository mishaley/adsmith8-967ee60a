
import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Home from './Home';
import Organizations from './Organizations';
import Offerings from './Offerings';
import Messages from './Messages';
import Personas from './Personas';
import Campaigns from './Campaigns';
import Images from './Images';
import Captions from './Captions';
import Settings from './Settings';
import NotFound from './NotFound';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // If we're at the root, redirect to /images
    if (window.location.pathname === '/') {
      navigate('/images');
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/organizations" element={<Organizations />} />
      <Route path="/offerings" element={<Offerings />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/personas" element={<Personas />} />
      <Route path="/campaigns" element={<Campaigns />} />
      <Route path="/images" element={<Images />} />
      <Route path="/captions" element={<Captions />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Index;
