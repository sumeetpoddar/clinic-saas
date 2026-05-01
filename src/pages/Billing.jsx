import React from 'react';
import { Receipt, Download, Plus } from 'lucide-react';
import { mockInvoices } from '../data/mockData';

export default function Billing() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2>Billing & Invoices</h2>
          <p className="text-muted">Manage payments and generate invoices.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} />
          Create Invoice
        </button>
      </div>

      <div className="stats-grid flex gap-4 mt-4 mb-4">
        <div className="glass-card flex-1 p-4">
           <p className="text-muted" style={{fontSize: '0.85rem'}}>Total Revenue (Month)</p>
           <h3>₹1,45,000</h3>
        </div>
        <div className="glass-card flex-1 p-4">
           <p className="text-muted" style={{fontSize: '0.85rem'}}>Pending Payments</p>
           <h3>₹12,500</h3>
        </div>
      </div>

      <div className="glass-card p-0">
        <div className="table-container p-4">
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
              {mockInvoices.map(invoice => (
                <tr key={invoice.id}>
                  <td style={{fontWeight: 500, color: 'var(--primary)'}}>{invoice.id}</td>
                  <td>{invoice.patientName}</td>
                  <td>{invoice.date}</td>
                  <td style={{fontWeight: 600}}>₹{invoice.amount}</td>
                  <td>
                    <span className={`badge ${invoice.status === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-secondary" style={{padding: '0.4rem 0.8rem', fontSize: '0.8rem'}}>
                      <Download size={14} style={{marginRight: '4px'}}/> Download PDF
                    </button>
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
