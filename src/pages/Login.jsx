import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { HeartPulse, Lock, Mail } from 'lucide-react';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Account created! You can now log in.');
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container flex items-center justify-center">
      <div className="login-card glass-panel flex-col items-center">
        <div className="logo-icon btn-primary" style={{ padding: '12px', borderRadius: '12px', marginBottom: '1rem' }}>
          <HeartPulse size={32} color="white" />
        </div>
        <h2 className="mb-4 text-center">Welcome to ClinicSync</h2>
        
        {error && <div className="alert-error mb-4">{error}</div>}

        <form onSubmit={handleAuth} className="w-full flex-col gap-4">
          <div className="input-group relative" style={{marginBottom: 0}}>
            <Mail className="input-icon text-muted" size={18} />
            <input 
              type="email" 
              placeholder="Doctor's Email" 
              className="input-field w-full pl-10" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group relative mt-4">
            <Lock className="input-icon text-muted" size={18} />
            <input 
              type="password" 
              placeholder="Password" 
              className="input-field w-full pl-10" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading}>
            {loading ? 'Authenticating...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <p className="mt-4 text-muted text-sm text-center">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button className="text-primary font-bold ml-1 bg-transparent border-none cursor-pointer" onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}
