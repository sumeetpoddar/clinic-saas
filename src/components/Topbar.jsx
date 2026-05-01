import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';
import './Topbar.css';

export default function Topbar() {
  return (
    <header className="topbar flex items-center justify-between glass-panel">
      <div className="search-bar flex items-center gap-2">
        <Search size={18} className="text-muted" style={{color: 'var(--text-muted)'}} />
        <input type="text" placeholder="Search patients, appointments..." className="search-input" />
      </div>
      
      <div className="topbar-actions flex items-center gap-4">
        <button className="btn-icon relative">
          <Bell size={20} />
          <span className="notification-badge"></span>
        </button>
        <button className="btn-icon">
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
}
