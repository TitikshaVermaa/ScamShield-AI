import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import RiskCard from '../components/RiskCard';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const { data } = await api.post('/scan', { messageText: text });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze text');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}</h1>
        <p>Paste any suspicious message, email, or link below to scan it for scams.</p>
      </div>

      <div className="scan-section">
        <form onSubmit={handleScan}>
          <textarea 
            className="scan-input" 
            placeholder="Paste text here... (e.g. 'Urgent OTP verify now...')"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows="5"
          ></textarea>
          
          <button type="submit" className="btn-primary scan-btn" disabled={isLoading || !text.trim()}>
            {isLoading ? 'Analyzing...' : 'Scan Now'}
          </button>
        </form>
        {error && <div className="error-message" style={{marginTop: '1rem'}}>{error}</div>}
      </div>

      {result && <RiskCard result={result} />}
    </div>
  );
};

export default Dashboard;
