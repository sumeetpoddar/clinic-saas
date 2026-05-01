import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Pill, Receipt, Archive, HeartPulse, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Sidebar.css';

const navItems = [
  { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { path: '/patients', label: 'Patients', icon: <Users size={20} /> },
  { path: '/appointments', label: 'Appointments', icon: <Calendar size={20} /> },
  { path: '/prescriptions', label: 'Prescriptions', icon: <Pill size={20} /> },
  { path: '/billing', label: 'Billing', icon: <Receipt size={20} /> },
  { path: '/inventory', label: 'Inventory', icon: <Archive size={20} /> },
];

export default function Sidebar() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header flex items-center gap-2">
        <div className="logo-icon btn-primary" style={{ padding: '8px', borderRadius: '8px' }}>
          <HeartPulse size={24} color="white" />
        </div>
        <h2 className="text-gradient" style={{ fontSize: '1.25rem', marginBottom: 0 }}>ClinicSync</h2>
      </div>
      
      <nav className="sidebar-nav flex-col">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <div className="doctor-profile flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="avatar">DR</div>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Doctor</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Online</p>
            </div>
          </div>
          <button className="btn-icon" onClick={handleLogout} title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
