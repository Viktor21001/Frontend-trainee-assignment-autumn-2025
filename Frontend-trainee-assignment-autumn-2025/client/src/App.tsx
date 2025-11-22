import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { AdsList } from './pages/AdsList';
import { AdDetails } from './pages/AdDetails';
import { Stats } from './pages/Stats';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/list" replace />} />
        <Route path="list" element={<AdsList />} />
        <Route path="item/:id" element={<AdDetails />} />
        <Route path="stats" element={<Stats />} />
      </Route>
    </Routes>
  );
};

export default App;
