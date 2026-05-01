import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Pill, Receipt, Archive, HeartPulse } from 'lucide-react';
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
        <div className="doctor-profile flex items-center gap-2">
          <div className="avatar">DR</div>
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Dr. Sharma</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>General Physician</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
