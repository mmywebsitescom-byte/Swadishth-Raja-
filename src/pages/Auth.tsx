import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Simulate login or signup
    login(name || 'Valued Customer', email);
    navigate('/profile');
  };

  return (
    <div className="container" style={{ padding: '4rem 1rem', minHeight: '80vh', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#c53030' }}>
          {isLogin ? 'Welcome Back' : 'Create an Account'}
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!isLogin && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                placeholder="Your full name"
                required={!isLogin}
              />
            </div>
          )}
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
            <input 
              type="password" 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
