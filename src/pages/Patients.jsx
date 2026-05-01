import React, { useState } from 'react';
import { Search, Plus, Filter, FileText } from 'lucide-react';
import { mockPatients } from '../data/mockData';

export default function Patients() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2>Patient Records</h2>
          <p className="text-muted">Manage your patient directory and history analytics.</p>
        </div>
        <button className="btn btn-primary">
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
              {mockPatients.map(patient => (
                <tr key={patient.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="avatar" style={{width: '32px', height: '32px', fontSize: '0.8rem'}}>{patient.name.charAt(0)}</div>
                      <span style={{fontWeight: 500}}>{patient.name}</span>
                    </div>
                  </td>
                  <td>{patient.age} • {patient.gender}</td>
                  <td>{patient.phone}</td>
                  <td>{patient.lastVisit}</td>
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
    </div>
  );
}
