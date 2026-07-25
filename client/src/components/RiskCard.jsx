import React from 'react';
import './RiskCard.css';

const RiskCard = ({ result }) => {
  if (!result) return null;

  const { riskLevel, riskScore, scamCategory, aiExplanation, reasons, safetyRecommendations } = result;

  const getRiskColor = (level) => {
    switch (level) {
      case 'High': return 'risk-high';
      case 'Medium': return 'risk-medium';
      case 'Low': return 'risk-low';
      default: return '';
    }
  };

  return (
    <div className={`risk-card ${getRiskColor(riskLevel)}`}>
      <div className="risk-header">
        <h2>{riskLevel} Risk</h2>
        <div className="score-circle">
          <span>{riskScore}</span>
        </div>
      </div>
      
      <div className="risk-body">
        <p><strong>Category:</strong> {scamCategory}</p>
        <p><strong>AI Assessment:</strong> {aiExplanation}</p>
        
        {reasons && reasons.length > 0 && (
          <div className="risk-list">
            <strong>Flags Detected:</strong>
            <ul>
              {reasons.map((reason, idx) => <li key={idx}>{reason}</li>)}
            </ul>
          </div>
        )}
        
        {safetyRecommendations && safetyRecommendations.length > 0 && (
          <div className="risk-list">
            <strong>Safety Recommendations:</strong>
            <ul>
              {safetyRecommendations.map((tip, idx) => <li key={idx}>{tip}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskCard;
