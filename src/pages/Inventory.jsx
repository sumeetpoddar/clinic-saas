import React from 'react';
import { Archive, Plus, AlertTriangle } from 'lucide-react';
import { mockInventory } from '../data/mockData';

export default function Inventory() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2>Medicine Inventory</h2>
          <p className="text-muted">Track your clinic's pharmacy stock.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} />
          Add Medicine
        </button>
      </div>

      <div className="glass-card p-0">
        <div className="table-container p-4">
          <table>
            <thead>
              <tr>
                <th>Medicine Name</th>
                <th>Stock Level</th>
                <th>Unit</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockInventory.map(item => (
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
                      <span className="badge badge-danger" style={{background: '#FEE2E2', color: '#B91C1C'}}>
                        <AlertTriangle size={12} style={{marginRight: '4px', display: 'inline-block'}} />
                        Low Stock
                      </span>
                    ) : (
                      <span className="badge badge-success">{item.status}</span>
                    )}
                  </td>
                  <td>
                    <button className="btn btn-secondary" style={{padding: '0.4rem 0.8rem', fontSize: '0.8rem'}}>
                      Update Stock
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
