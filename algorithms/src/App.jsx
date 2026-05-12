import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AlgoDetail from './pages/AlgoDetail';
import { ALGORITHMS } from './data/algorithms';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Default redirect to first algorithm for clean UX */}
          <Route index element={<Navigate to={`/algo/${ALGORITHMS[0].slug}`} replace />} />
          
          {/* Dynamic route for specific algorithm stats */}
          <Route path="algo/:algoSlug" element={<AlgoDetail />} />
          
          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
