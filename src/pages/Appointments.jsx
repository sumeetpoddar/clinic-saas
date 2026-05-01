import React from 'react';
import { Calendar as CalendarIcon, Clock, Plus } from 'lucide-react';
import { mockAppointments } from '../data/mockData';

export default function Appointments() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2>Appointments</h2>
          <p className="text-muted">Manage your daily schedule and upcoming bookings.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} />
          Schedule Appointment
        </button>
      </div>

      <div className="glass-card p-4">
        <div className="flex justify-between mb-4 items-center">
          <h3 style={{fontSize: '1.2rem', marginBottom: 0}}>Today's Schedule</h3>
          <input type="date" className="input-field" defaultValue="2026-05-01" />
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Patient Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockAppointments.map(app => (
                <tr key={app.id}>
                  <td>
                    <div className="flex items-center gap-2" style={{fontWeight: 500}}>
                      <Clock size={16} className="text-muted" style={{color: 'var(--text-muted)'}} />
                      {app.time}
                    </div>
                  </td>
                  <td style={{fontWeight: 500}}>{app.patientName}</td>
                  <td><span className="badge badge-primary">{app.type}</span></td>
                  <td>
                    <span className={`badge ${app.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>
                      {app.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-secondary" style={{padding: '0.4rem 0.8rem', fontSize: '0.8rem'}}>Reschedule</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
