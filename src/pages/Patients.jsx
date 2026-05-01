import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Modal from '../components/Modal';

export default function Patients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', age: '', gender: 'Male', phone: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error('Error fetching patients:', error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleAddPatient = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) throw new Error('User session not found. Please log in again.');
      
      const { error } = await supabase.from('patients').insert([
        { ...formData, doctor_id: user.id }
      ]);
      if (error) throw error;
      
      setIsModalOpen(false);
      setFormData({ name: '', age: '', gender: 'Male', phone: '' });
      fetchPatients(); // refresh list
    } catch (error) {
      alert('Error adding patient: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.phone && p.phone.includes(searchTerm))
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2>Patient Records</h2>
          <p className="text-muted">Manage your patient directory and history analytics.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          New Patient
        </button>
      </div>

      <div className="glass-card p-4 mb-4 flex justify-between items-center" style={{padding: '1rem'}}>
        <div className="search-bar flex items-center gap-2" style={{margin: 0}}>
          <Search size={18} className="text-muted" />
          <input 
            type="text" 
            placeholder="Search by name or phone..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-secondary">
          <Filter size={18} />
          Filters
        </button>
      </div>

      <div className="glass-card p-0">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age & Gender</th>
                <th>Phone</th>
                <th>Last Visit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center p-4">Loading patients...</td></tr>
              ) : filteredPatients.length === 0 ? (
                <tr><td colSpan="5" className="text-center p-4">No patients found.</td></tr>
              ) : filteredPatients.map(patient => (
                <tr key={patient.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="avatar" style={{width: '32px', height: '32px', fontSize: '0.8rem'}}>{patient.name.charAt(0)}</div>
                      <span style={{fontWeight: 500}}>{patient.name}</span>
                    </div>
                  </td>
                  <td>{patient.age} • {patient.gender}</td>
                  <td>{patient.phone}</td>
                  <td>{patient.last_visit || 'New'}</td>
                  <td>
                    <button className="btn btn-secondary" style={{padding: '0.4rem 0.8rem', fontSize: '0.8rem'}}>
                      <FileText size={14} style={{marginRight: '4px'}}/> View History
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Patient">
        <form onSubmit={handleAddPatient} className="flex-col gap-4">
          <div className="input-group">
            <label>Full Name</label>
            <input 
              type="text" 
              className="input-field w-full" 
              required 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="flex gap-4">
            <div className="input-group flex-1">
              <label>Age</label>
              <input 
                type="number" 
                className="input-field w-full" 
                required
                value={formData.age}
                onChange={e => setFormData({...formData, age: e.target.value})}
              />
            </div>
            <div className="input-group flex-1">
              <label>Gender</label>
              <select 
                className="input-field w-full" 
                value={formData.gender}
                onChange={e => setFormData({...formData, gender: e.target.value})}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div className="input-group">
            <label>Phone Number</label>
            <input 
              type="tel" 
              className="input-field w-full" 
              required
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Patient'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
