// Simple rule engine to detect common scam keywords and domains
const analyzeText = (text) => {
  const lowerText = text.toLowerCase();
  let score = 0;
  const reasons = [];

  // Define suspicious keywords and phrases
  const keywordRules = [
    { word: 'otp', weight: 30 },
    { word: 'verify now', weight: 40 },
    { word: 'click here', weight: 20 },
    { word: 'urgent', weight: 20 },
    { word: 'account blocked', weight: 40 },
    { word: 'lottery', weight: 50 },
    { word: 'upi', weight: 30 },
    { word: 'kyc', weight: 40 },
  ];

  // Define suspicious domains
  const domainRules = ['.xyz', '.top', '.click'];

  // Check keywords
  keywordRules.forEach(rule => {
    if (lowerText.includes(rule.word)) {
      score += rule.weight;
      reasons.push(`Detected suspicious keyword: "${rule.word}"`);
    }
  });

  // Check domains
  domainRules.forEach(domain => {
    if (lowerText.includes(domain)) {
      score += 50;
      reasons.push(`Detected suspicious domain extension: "${domain}"`);
    }
  });

  // Cap score at 100
  score = Math.min(score, 100);

  // Determine basic category based on keywords
  let category = 'Unknown';
  if (lowerText.includes('lottery')) category = 'Lottery Scam';
  else if (lowerText.includes('kyc') || lowerText.includes('account blocked')) category = 'Banking/KYC Scam';
  else if (lowerText.includes('otp') || lowerText.includes('upi')) category = 'Financial Scam';
  else if (score > 0) category = 'Phishing/Spam';

  return {
    score,
    reasons,
    category
  };
};

export { analyzeText };
