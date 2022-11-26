import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.tsx';

const SidebarLayout = () => (
  <>
    <Sidebar />
    <Outlet />
  </>
);

export default SidebarLayout;
