import React from 'react';
import { Users, Calendar, TrendingUp, Activity } from 'lucide-react';
import { mockAppointments, mockPatients } from '../data/mockData';

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2>Good morning, Dr. Sharma</h2>
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
            <h3>1,248</h3>
          </div>
        </div>
        
        <div className="glass-card flex-1 p-4 flex items-center gap-4">
          <div className="logo-icon bg-success-light p-3 rounded" style={{background: '#D1FAE5', color: 'var(--success)', borderRadius: '12px'}}>
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-muted" style={{fontSize: '0.85rem'}}>Today's Appointments</p>
            <h3>{mockAppointments.length}</h3>
          </div>
        </div>

        <div className="glass-card flex-1 p-4 flex items-center gap-4">
          <div className="logo-icon bg-warning-light p-3 rounded" style={{background: '#FEF3C7', color: 'var(--warning)', borderRadius: '12px'}}>
            <Activity size={24} />
          </div>
          <div>
            <p className="text-muted" style={{fontSize: '0.85rem'}}>Pending Follow-ups</p>
            <h3>12</h3>
          </div>
        </div>

        <div className="glass-card flex-1 p-4 flex items-center gap-4">
          <div className="logo-icon bg-secondary-light p-3 rounded" style={{background: '#E0F2FE', color: 'var(--secondary)', borderRadius: '12px'}}>
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-muted" style={{fontSize: '0.85rem'}}>Revenue Today</p>
            <h3>₹5,400</h3>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="glass-card p-4 flex-2 w-full" style={{flex: 2}}>
          <h3 style={{fontSize: '1.25rem', marginBottom: '1rem', padding: '1rem'}}>Today's Appointments</h3>
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
                {mockAppointments.map(app => (
                  <tr key={app.id}>
                    <td style={{fontWeight: 500}}>{app.patientName}</td>
                    <td>{app.time}</td>
                    <td><span className="badge badge-primary">{app.type}</span></td>
                    <td>
                      <span className={`badge ${app.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>
                        {app.status}
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
            {mockPatients.map(patient => (
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
