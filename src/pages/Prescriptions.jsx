import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Plus, FileSignature } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Prescriptions() {
  const [isRecording, setIsRecording] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [sending, setSending] = useState(false);
  
  const [patients, setPatients] = useState([]);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    async function loadData() {
      const { data: pData } = await supabase.from('patients').select('*').order('name');
      const { data: iData } = await supabase.from('inventory').select('*').order('name');
      if (pData) setPatients(pData);
      if (iData) setInventory(iData);
    }
    loadData();
  }, []);
  
  const toggleRecording = () => {
    if(!isRecording) {
      setIsRecording(true);
      // Simulate voice typing
      let text = "Patient presents with mild fever and dry cough. Prescribing Paracetamol 500mg twice a day after meals. Rest for 3 days.";
      let index = 0;
      setVoiceText('');
      const interval = setInterval(() => {
        setVoiceText((prev) => prev + text.charAt(index));
        index++;
        if (index >= text.length) {
          clearInterval(interval);
          setIsRecording(false);
        }
      }, 50);
    } else {
      setIsRecording(false);
    }
  };

  const handleSendWhatsApp = async () => {
    setSending(true);
    try {
      const response = await fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: '+1234567890', // In a real scenario, fetch the selected patient's phone number here
          body: `Hello! Your prescription from ClinicSync is ready. Details: ${voiceText || 'Paracetamol 500mg'}`
        })
      });
      const data = await response.json();
      if (data.success) {
        alert('Message sent successfully via Twilio!');
      } else {
        alert('Failed to send message: ' + data.error);
      }
    } catch (error) {
      alert('Error sending message: ' + error.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2>Generate Prescription</h2>
          <p className="text-muted">Write or dictate prescriptions easily.</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="glass-card p-4 flex-2" style={{flex: 2, padding: '1.5rem'}}>
          <div className="input-group">
            <label>Select Patient</label>
            <select className="input-field">
              <option value="">-- Choose Patient --</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div className="input-group">
            <label className="flex justify-between items-center w-full">
              <span>Voice Dictation (AI)</span>
              <span className={`badge ${isRecording ? 'badge-danger' : 'badge-primary'}`}>
                {isRecording ? 'Recording...' : 'Ready'}
              </span>
            </label>
            <div className="relative">
              <textarea 
                className="input-field w-full" 
                rows="4" 
                placeholder="Click the mic and start speaking, or type manually..."
                value={voiceText}
                onChange={(e) => setVoiceText(e.target.value)}
              ></textarea>
              <button 
                onClick={toggleRecording}
                className={`btn-icon absolute ${isRecording ? 'bg-danger text-white' : ''}`}
                style={{
                  position: 'absolute', bottom: '10px', right: '10px', 
                  background: isRecording ? 'var(--danger)' : 'white',
                  color: isRecording ? 'white' : 'var(--primary)'
                }}
              >
                {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
            </div>
            <p className="text-muted" style={{fontSize: '0.8rem'}}>Our AI will automatically extract medicines and dosages from your voice.</p>
          </div>

          <div className="input-group mt-4">
            <label>Medicines</label>
            <div className="flex items-center gap-2 mb-2">
              <select className="input-field" style={{flex: 1}}>
                <option value="">-- Select Medicine from Inventory --</option>
                {inventory.map(m => <option key={m.id} value={m.id}>{m.name} ({m.stock} {m.unit})</option>)}
              </select>
              <input type="text" placeholder="Dosage (e.g. 1-0-1)" className="input-field" style={{width: '150px'}} />
              <button className="btn btn-secondary"><Plus size={18} /> Add</button>
            </div>
            <div className="glass-panel p-2 mt-2">
               <div className="flex justify-between items-center p-2 border-b">
                 <span style={{fontWeight: 500}}>1. Paracetamol 500mg</span>
                 <span className="badge badge-warning">1-0-1 After Meals</span>
               </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button className="btn btn-secondary">Preview</button>
            <button className="btn btn-primary" onClick={handleSendWhatsApp} disabled={sending}>
              <FileSignature size={18}/> {sending ? 'Sending...' : 'Send WhatsApp Reminder'}
            </button>
          </div>
        </div>
        
        <div className="glass-card p-4 flex-1" style={{flex: 1, alignSelf: 'flex-start'}}>
          <h3 style={{fontSize: '1.25rem', marginBottom: '1rem'}}>Patient History Snapshot</h3>
          <div className="p-4 rounded flex flex-col items-center justify-center text-center" style={{background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', minHeight: '200px'}}>
             <FileSignature size={40} className="text-muted mb-2" opacity={0.5} />
             <p className="text-muted text-sm">Select a patient to view history analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
}
