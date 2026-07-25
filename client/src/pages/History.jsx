import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import RiskCard from '../components/RiskCard';
import Loader from '../components/Loader';
import './History.css';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/scan/history');
        setHistory(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container history-container">
      <div className="history-header">
        <h1>Scan History</h1>
        <p>View your previous scam analysis reports.</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="history-list">
        {history.length === 0 && !error ? (
          <div className="history-content">
            <div className="empty-state">
              <div className="icon">🛡️</div>
              <h2>No history found</h2>
              <p>You haven't scanned any messages yet.</p>
              <Link to="/dashboard" className="btn-primary btn-inline">Go Scan Something</Link>
            </div>
          </div>
        ) : (
          history.map((item) => (
            <div key={item._id} className="history-item">
              <div className="history-text-preview">
                <strong>Message:</strong> "{item.messageText.substring(0, 100)}{item.messageText.length > 100 ? '...' : ''}"
              </div>
              <RiskCard result={item} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
