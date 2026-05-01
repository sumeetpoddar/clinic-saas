import React, { useEffect, useState } from 'react';
import { Users, Calendar, TrendingUp, Activity } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    async function loadData() {
      const { data: pData } = await supabase.from('patients').select('*').limit(5).order('created_at', { ascending: false });
      const { data: aData } = await supabase.from('appointments').select('*').limit(5).order('created_at', { ascending: false });
      if (pData) setPatients(pData);
      if (aData) setAppointments(aData);
    }
    loadData();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2>Good morning, Doctor</h2>
          <p className="text-muted">Here's what's happening at your clinic today.</p>
        </div>
        <button className="btn btn-primary">
          <Calendar size={18} />
          New Appointment
        </button>
      </div>

      <div className="stats-grid flex gap-4 mt-4 mb-4">
        <div className="glass-card flex-1 p-4 flex items-center gap-4">
          <div className="logo-icon bg-primary-light p-3 rounded" style={{background: '#E0E7FF', color: 'var(--primary)', borderRadius: '12px'}}>
            <Users size={24} />
          </div>
          <div>
            <p className="text-muted" style={{fontSize: '0.85rem'}}>Total Patients</p>
            <h3>{patients.length || 0}</h3>
          </div>
        </div>
        
        <div className="glass-card flex-1 p-4 flex items-center gap-4">
          <div className="logo-icon bg-success-light p-3 rounded" style={{background: '#D1FAE5', color: 'var(--success)', borderRadius: '12px'}}>
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-muted" style={{fontSize: '0.85rem'}}>Today's Appointments</p>
            <h3>{appointments.length || 0}</h3>
          </div>
        </div>

        <div className="glass-card flex-1 p-4 flex items-center gap-4">
          <div className="logo-icon bg-warning-light p-3 rounded" style={{background: '#FEF3C7', color: 'var(--warning)', borderRadius: '12px'}}>
            <Activity size={24} />
          </div>
          <div>
            <p className="text-muted" style={{fontSize: '0.85rem'}}>Pending Follow-ups</p>
            <h3>0</h3>
          </div>
        </div>

        <div className="glass-card flex-1 p-4 flex items-center gap-4">
          <div className="logo-icon bg-secondary-light p-3 rounded" style={{background: '#E0F2FE', color: 'var(--secondary)', borderRadius: '12px'}}>
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-muted" style={{fontSize: '0.85rem'}}>Revenue Today</p>
            <h3>₹0</h3>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="glass-card p-4 flex-2 w-full" style={{flex: 2}}>
          <h3 style={{fontSize: '1.25rem', marginBottom: '1rem', padding: '1rem'}}>Recent Appointments</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Time</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr><td colSpan="4" className="text-center p-4">No appointments found.</td></tr>
                ) : appointments.map(app => (
                  <tr key={app.id}>
                    <td style={{fontWeight: 500}}>{app.patient_name}</td>
                    <td>{app.time}</td>
                    <td><span className="badge badge-primary">{app.type || 'Consultation'}</span></td>
                    <td>
                      <span className={`badge ${app.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>
                        {app.status || 'Scheduled'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card p-4 flex-1 w-full" style={{flex: 1}}>
          <h3 style={{fontSize: '1.25rem', marginBottom: '1rem'}}>Recent Patients</h3>
          <div className="flex flex-col gap-4">
            {patients.length === 0 ? (
              <p className="text-muted text-sm">No patients yet.</p>
            ) : patients.map(patient => (
              <div key={patient.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded" style={{transition: 'var(--transition)'}}>
                <div className="flex items-center gap-3">
                  <div className="avatar" style={{width: '32px', height: '32px', fontSize: '0.8rem'}}>{patient.name.charAt(0)}</div>
                  <div>
                    <p style={{fontWeight: 500, fontSize: '0.9rem'}}>{patient.name}</p>
                    <p className="text-muted" style={{fontSize: '0.75rem'}}>{patient.age} yrs • {patient.gender}</p>
                  </div>
                </div>
                <button className="btn-icon" style={{width: '28px', height: '28px'}}>
                  <Activity size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
