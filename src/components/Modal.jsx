import React from 'react';
import { X } from 'lucide-react';
import './Modal.css';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-card animate-fade-in">
        <div className="modal-header flex justify-between items-center mb-4">
          <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{title}</h3>
          <button className="btn-icon" onClick={onClose} style={{ padding: '0.25rem', width: 'auto', height: 'auto' }}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
