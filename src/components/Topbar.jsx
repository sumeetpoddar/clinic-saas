import React, { useState } from 'react';
import { Search, Bell, Settings, LogOut, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Topbar.css';

export default function Topbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <header className="topbar">
      <div className="search-bar">
        <Search size={18} className="text-muted" />
        <input type="text" placeholder="Search patients, appointments..." className="search-input" />
      </div>
      <div className="topbar-actions flex items-center gap-2" style={{ position: 'relative' }}>
        
        {/* Notifications Icon & Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            className="btn-icon badge-container" 
            onClick={() => { setShowNotifications(!showNotifications); setShowSettings(false); }}
          >
            <Bell size={20} />
            <span className="notification-dot"></span>
          </button>
          
          {showNotifications && (
            <div className="glass-card" style={{ position: 'absolute', top: '120%', right: 0, width: '280px', zIndex: 100, padding: '1rem' }}>
              <h4 style={{ marginBottom: '0.8rem', fontSize: '0.9rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
                Notifications
              </h4>
              <div className="flex-col gap-2">
                <div style={{ padding: '0.6rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                  <strong style={{color: 'var(--primary)', display: 'block', marginBottom: '2px'}}>System Update</strong>
                  Your clinic backend is now fully live and synchronized.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Settings Icon & Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            className="btn-icon" 
            onClick={() => { setShowSettings(!showSettings); setShowNotifications(false); }}
          >
            <Settings size={20} />
          </button>

          {showSettings && (
            <div className="glass-card flex-col" style={{ position: 'absolute', top: '120%', right: 0, width: '200px', zIndex: 100, padding: '0.5rem' }}>
              <button className="btn btn-secondary w-full" onClick={() => alert("Clinic settings coming soon!")} style={{ justifyContent: 'flex-start', marginBottom: '0.2rem', border: 'none', background: 'transparent' }}>
                <User size={16}/> Account Settings
              </button>
              <button className="btn btn-secondary w-full" onClick={handleLogout} style={{ justifyContent: 'flex-start', color: 'var(--danger)', border: 'none', background: 'transparent' }}>
                <LogOut size={16}/> Sign Out
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
