import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, FileText, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Modal from '../components/Modal';

export default function Patients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal & Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
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

  const openNewModal = () => {
    setEditingId(null);
    setFormData({ name: '', age: '', gender: 'Male', phone: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (patient) => {
    setEditingId(patient.id);
    setFormData({ name: patient.name, age: patient.age, gender: patient.gender, phone: patient.phone });
    setIsModalOpen(true);
  };

  const handleDeletePatient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient? This action cannot be undone.")) return;
    try {
      const { error } = await supabase.from('patients').delete().eq('id', id);
      if (error) throw error;
      fetchPatients(); // refresh list
    } catch (error) {
      alert('Error deleting patient: ' + error.message);
    }
  };

  const handleSavePatient = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) throw new Error('User session not found. Please log in again.');
      
      if (editingId) {
        // Update existing patient
        const { error } = await supabase.from('patients')
          .update({ name: formData.name, age: formData.age, gender: formData.gender, phone: formData.phone })
          .eq('id', editingId);
        if (error) throw error;
      } else {
        // Create new patient
        const { error } = await supabase.from('patients').insert([
          { ...formData, doctor_id: user.id }
        ]);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      fetchPatients();
    } catch (error) {
      alert('Error saving patient: ' + error.message);
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
        <button className="btn btn-primary" onClick={openNewModal}>
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
                    <div className="flex items-center gap-2">
                      <button className="btn btn-secondary" title="View History" style={{padding: '0.4rem 0.6rem'}}>
                        <FileText size={14} />
                      </button>
                      <button className="btn btn-secondary" title="Edit Patient" onClick={() => openEditModal(patient)} style={{padding: '0.4rem 0.6rem', color: 'var(--primary)'}}>
                        <Edit2 size={14} />
                      </button>
                      <button className="btn btn-secondary" title="Delete Patient" onClick={() => handleDeletePatient(patient.id)} style={{padding: '0.4rem 0.6rem', color: 'var(--danger)'}}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Patient" : "Add New Patient"}>
        <form onSubmit={handleSavePatient} className="flex-col gap-4">
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
              {saving ? 'Saving...' : (editingId ? 'Update Patient' : 'Save Patient')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
