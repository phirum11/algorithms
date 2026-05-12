import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-main selection:bg-cyan-500/20">
      <Navbar />
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-8 py-6 overflow-hidden grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 h-[calc(100vh-72px)]">
        {/* Removed sidebar per user request */}
        <Outlet />
      </main>
    </div>
  );
}
