import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, Filter, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Modal from '../components/Modal';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ patient_id: '', date: '', time: '', type: 'Consultation' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [apptRes, patRes] = await Promise.all([
        supabase.from('appointments').select('*').order('date', { ascending: true }),
        supabase.from('patients').select('id, name')
      ]);
      
      if (apptRes.data) setAppointments(apptRes.data);
      if (patRes.data) setPatients(patRes.data);
    } catch (error) {
      console.error('Error fetching appointments:', error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleSchedule = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) throw new Error('User session not found. Please log in again.');
      
      const patient = patients.find(p => p.id === formData.patient_id);
      
      const { error } = await supabase.from('appointments').insert([{
        doctor_id: user.id,
        patient_id: formData.patient_id,
        patient_name: patient ? patient.name : 'Walk-in',
        date: formData.date,
        time: formData.time,
        type: formData.type,
        status: 'Scheduled'
      }]);
      if (error) throw error;
      
      setIsModalOpen(false);
      setFormData({ patient_id: '', date: '', time: '', type: 'Consultation' });
      fetchData(); // refresh list
    } catch (error) {
      alert('Error scheduling: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2>Appointments</h2>
          <p className="text-muted">Manage your daily schedule and upcoming bookings.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Schedule Appointment
        </button>
      </div>

      <div className="glass-card p-4 mb-4 flex justify-between items-center" style={{padding: '1rem'}}>
        <div className="flex gap-2">
           <button className="btn btn-secondary active">Today</button>
           <button className="btn btn-secondary">Tomorrow</button>
           <button className="btn btn-secondary">Upcoming</button>
        </div>
        <div className="flex gap-2">
           <button className="btn btn-secondary"><Filter size={18}/> Filter</button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="glass-card flex-2 p-0 w-full" style={{flex: 2}}>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date & Time</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" className="text-center p-4">Loading...</td></tr>
                ) : appointments.length === 0 ? (
                  <tr><td colSpan="4" className="text-center p-4">No appointments scheduled.</td></tr>
                ) : appointments.map(app => (
                  <tr key={app.id}>
                    <td>
                      <div className="flex items-center gap-2">
                         <div className="avatar bg-primary-light" style={{width: '32px', height: '32px'}}>
                            <User size={16} />
                         </div>
                         <span style={{fontWeight: 500}}>{app.patient_name}</span>
                      </div>
                    </td>
                    <td>
                       <div className="flex items-center gap-2">
                         <CalendarIcon size={14} className="text-muted"/> {app.date}
                         <Clock size={14} className="text-muted ml-2"/> {app.time}
                       </div>
                    </td>
                    <td><span className="badge badge-secondary">{app.type}</span></td>
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

        <div className="glass-card flex-1 p-4 w-full" style={{flex: 1, alignSelf: 'flex-start'}}>
          <h3 style={{marginBottom: '1rem'}}>Calendar Integration</h3>
          <div className="p-4 rounded text-center mb-4" style={{background: 'var(--bg-main)'}}>
             <CalendarIcon size={32} className="text-muted mx-auto mb-2" opacity={0.5} />
             <p className="text-sm">Connect Google Calendar to sync appointments automatically.</p>
             <button className="btn btn-secondary w-full mt-2" style={{justifyContent: 'center'}}>Connect Calendar</button>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule Appointment">
        <form onSubmit={handleSchedule} className="flex-col gap-4">
          <div className="input-group">
            <label>Select Patient</label>
            <select 
              className="input-field w-full" 
              required
              value={formData.patient_id}
              onChange={e => setFormData({...formData, patient_id: e.target.value})}
            >
              <option value="">-- Choose Patient --</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="flex gap-4">
            <div className="input-group flex-1">
              <label>Date</label>
              <input 
                type="date" 
                className="input-field w-full" 
                required
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div className="input-group flex-1">
              <label>Time</label>
              <input 
                type="time" 
                className="input-field w-full" 
                required
                value={formData.time}
                onChange={e => setFormData({...formData, time: e.target.value})}
              />
            </div>
          </div>
          <div className="input-group">
            <label>Appointment Type</label>
            <select 
              className="input-field w-full"
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value})}
            >
              <option>Consultation</option>
              <option>Follow-up</option>
              <option>Routine Checkup</option>
              <option>Emergency</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Scheduling...' : 'Confirm Appointment'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
