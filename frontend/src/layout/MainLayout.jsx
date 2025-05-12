import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import FloatingCard from '@/components/FloatingCard'; // ✅ Import FloatingCard

const MainLayout = () => {
  return (
    <div className='flex flex-col min-h-screen relative'>
      <Navbar />
      <div className='flex-1'>
        <Outlet />
      </div>
      <FloatingCard /> {/* ✅ Placed within the routing context */}
    </div>
  );
};

export default MainLayout;
