import React from 'react';
import { Outlet } from 'react-router-dom';
import AccountSidebar from './AccountSidebar';
import './account-dashboard.css';

const AccountDashboardLayout = () => {
  return (
    <div className="account-dashboard-container">
      <div className="account-sidebar-wrapper">
        <AccountSidebar />
      </div>
      <div className="account-content-wrapper">
        {/* The Outlet renders whichever nested route is currently active */}
        <Outlet />
      </div>
    </div>
  );
};

export default AccountDashboardLayout;