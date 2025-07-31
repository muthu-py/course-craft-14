import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        {children || <Outlet />}
      </main>
    </div>
  );
};