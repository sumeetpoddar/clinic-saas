import React, { useState, useEffect } from 'react';
import { Download, Plus, Filter, FileText, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Modal from '../components/Modal';

export default function Billing() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ patient_name: '', amount: '', date: '', status: 'Paid' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  async function fetchInvoices() {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('invoices').select('*').order('date', { ascending: false });
      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) throw new Error('User session not found. Please log in again.');
      
      const { error } = await supabase.from('invoices').insert([{
        doctor_id: user.id,
        patient_name: formData.patient_name,
        amount: parseFloat(formData.amount),
        date: formData.date,
        status: formData.status
      }]);
      if (error) throw error;
      
      setIsModalOpen(false);
      setFormData({ patient_name: '', amount: '', date: '', status: 'Paid' });
      fetchInvoices();
    } catch (error) {
      alert('Error creating invoice: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const totalRevenue = invoices.reduce((sum, inv) => inv.status === 'Paid' ? sum + Number(inv.amount) : sum, 0);
  const pendingAmount = invoices.reduce((sum, inv) => inv.status === 'Pending' ? sum + Number(inv.amount) : sum, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2>Billing & Invoices</h2>
          <p className="text-muted">Manage patient billing and track clinic revenue.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Create Invoice
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="glass-card p-4 flex-1 flex flex-col justify-center">
           <p className="text-muted" style={{fontSize: '0.9rem'}}>Total Revenue</p>
           <h2 style={{fontSize: '2rem', margin: '0.5rem 0'}}>₹{totalRevenue.toLocaleString()}</h2>
           <span className="badge badge-success inline-flex" style={{width: 'fit-content'}}>+12% this month</span>
        </div>
        <div className="glass-card p-4 flex-1 flex flex-col justify-center">
           <p className="text-muted" style={{fontSize: '0.9rem'}}>Pending Payments</p>
           <h2 style={{fontSize: '2rem', margin: '0.5rem 0'}}>₹{pendingAmount.toLocaleString()}</h2>
           <span className="badge badge-warning inline-flex" style={{width: 'fit-content'}}>Action Required</span>
        </div>
      </div>

      <div className="glass-card p-0">
        <div className="p-4 flex justify-between items-center border-b">
           <h3 style={{fontSize: '1.1rem'}}>Recent Invoices</h3>
           <button className="btn btn-secondary"><Filter size={18}/> Filters</button>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Patient Name</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center p-4">Loading invoices...</td></tr>
              ) : invoices.length === 0 ? (
                <tr><td colSpan="6" className="text-center p-4">No invoices created.</td></tr>
              ) : invoices.map(invoice => (
                <tr key={invoice.id}>
                  <td><span style={{fontWeight: 500, color: 'var(--primary)'}}>INV-{invoice.id.substring(0, 4).toUpperCase()}</span></td>
                  <td>{invoice.patient_name}</td>
                  <td>{invoice.date}</td>
                  <td style={{fontWeight: 600}}>₹{invoice.amount}</td>
                  <td>
                    {invoice.status === 'Paid' ? (
                      <span className="badge badge-success flex items-center gap-1 w-max"><CheckCircle size={12}/> Paid</span>
                    ) : (
                      <span className="badge badge-warning flex items-center gap-1 w-max"><Clock size={12}/> Pending</span>
                    )}
                  </td>
                  <td>
                    <button className="btn-icon" title="Download PDF"><Download size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Invoice">
        <form onSubmit={handleCreateInvoice} className="flex-col gap-4">
          <div className="input-group">
            <label>Patient Name</label>
            <input 
              type="text" 
              className="input-field w-full" 
              required
              value={formData.patient_name}
              onChange={e => setFormData({...formData, patient_name: e.target.value})}
            />
          </div>
          <div className="flex gap-4">
            <div className="input-group flex-1">
              <label>Amount (₹)</label>
              <input 
                type="number" 
                className="input-field w-full" 
                required
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
              />
            </div>
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
          </div>
          <div className="input-group">
            <label>Status</label>
            <select 
              className="input-field w-full"
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value})}
            >
              <option>Paid</option>
              <option>Pending</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Creating...' : 'Generate Invoice'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
