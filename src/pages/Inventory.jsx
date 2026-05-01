import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Modal from '../components/Modal';

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', stock: '', unit: 'Strips' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  async function fetchInventory() {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('inventory').select('*').order('name', { ascending: true });
      if (error) throw error;
      setInventory(data || []);
    } catch (error) {
      console.error('Error fetching inventory:', error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) throw new Error('User session not found. Please log in again.');
      
      const status = parseInt(formData.stock) < 20 ? 'Low Stock' : 'In Stock';
      
      const { error } = await supabase.from('inventory').insert([{
        doctor_id: user.id,
        name: formData.name,
        stock: parseInt(formData.stock),
        unit: formData.unit,
        status: status
      }]);
      if (error) throw error;
      
      setIsModalOpen(false);
      setFormData({ name: '', stock: '', unit: 'Strips' });
      fetchInventory();
    } catch (error) {
      alert('Error adding medicine: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2>Pharmacy Inventory</h2>
          <p className="text-muted">Manage your medicine stock and low-stock alerts.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Add Medicine
        </button>
      </div>

      <div className="glass-card p-4 mb-4 flex justify-between items-center" style={{padding: '1rem'}}>
        <div className="search-bar flex items-center gap-2" style={{margin: 0}}>
          <Search size={18} className="text-muted" />
          <input type="text" placeholder="Search medicines..." className="search-input"/>
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
                <th>Medicine Name</th>
                <th>Current Stock</th>
                <th>Unit</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center p-4">Loading inventory...</td></tr>
              ) : inventory.length === 0 ? (
                <tr><td colSpan="5" className="text-center p-4">No medicines in inventory.</td></tr>
              ) : inventory.map(item => (
                <tr key={item.id}>
                  <td style={{fontWeight: 500}}>{item.name}</td>
                  <td>
                    <span style={{fontWeight: 600, color: item.status === 'Low Stock' ? 'var(--danger)' : 'inherit'}}>
                      {item.stock}
                    </span>
                  </td>
                  <td>{item.unit}</td>
                  <td>
                    {item.status === 'Low Stock' ? (
                      <span className="badge badge-danger" style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}>
                        <AlertCircle size={12}/> Low Stock
                      </span>
                    ) : (
                      <span className="badge badge-success">In Stock</span>
                    )}
                  </td>
                  <td>
                    <button className="btn btn-secondary" style={{padding: '0.4rem 0.8rem', fontSize: '0.8rem'}}>Update</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Medicine">
        <form onSubmit={handleAddMedicine} className="flex-col gap-4">
          <div className="input-group">
            <label>Medicine Name</label>
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
              <label>Initial Stock</label>
              <input 
                type="number" 
                className="input-field w-full" 
                required
                value={formData.stock}
                onChange={e => setFormData({...formData, stock: e.target.value})}
              />
            </div>
            <div className="input-group flex-1">
              <label>Unit</label>
              <select 
                className="input-field w-full"
                value={formData.unit}
                onChange={e => setFormData({...formData, unit: e.target.value})}
              >
                <option>Strips</option>
                <option>Bottles</option>
                <option>Tablets</option>
                <option>Boxes</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Add to Inventory'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
