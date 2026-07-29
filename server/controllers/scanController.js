import { GoogleGenAI } from '@google/genai';
import Scan from '../models/Scan.js';
import { analyzeText } from '../utils/ruleEngine.js';

// @desc    Analyze text for scams
// @route   POST /api/scan
// @access  Private
const analyzeScam = async (req, res) => {
  try {
    const { messageText } = req.body;

    if (!messageText) {
      res.status(400);
      throw new Error('Please provide text to analyze');
    }

    // 1. Run the local Rule Engine
    const ruleResult = analyzeText(messageText);

    let aiCategory = 'Unknown';
    let aiExplanation = 'AI analysis not available';
    let safetyRecommendations = ['Do not click on any suspicious links', 'Never share your OTP or passwords'];
    let aiRiskScore = 0;
    let status = 'Success';

    // 2. Call Gemini AI for advanced analysis
    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
      });

      const prompt = `
You are a scam detection assistant.

Analyze this message:

"${messageText}"

Return ONLY valid JSON.
Do not use markdown.
Do not write any explanation outside JSON.

{
  "aiCategory": "",
  "aiExplanation": "",
  "aiRiskScore": 0,
  "safetyRecommendations": []
}
`;

      const result = await ai.models.generateContent({
        model: 'gemini-3.6-flash'
        contents: prompt
      });

      const responseText = result.text;
      
      // Clean up markdown in case the model ignores the prompt rules
      const cleanJsonStr = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      
      const parsedAiData = JSON.parse(cleanJsonStr);

      aiCategory = parsedAiData.aiCategory || 'Unknown';
      aiExplanation = parsedAiData.aiExplanation || 'No explanation provided by AI.';
      aiRiskScore = Number(parsedAiData.aiRiskScore) || 0;
      safetyRecommendations = (parsedAiData.safetyRecommendations && parsedAiData.safetyRecommendations.length > 0) 
        ? parsedAiData.safetyRecommendations 
        : safetyRecommendations;
      
    }  catch (aiError) {
  console.error("Gemini Full Error:", aiError);

  status = "Failed";
  aiExplanation =
    aiError?.message || JSON.stringify(aiError);
}
    // 3. Combine scores (average of rule engine and AI score)
    // If Gemini failed, we rely 100% on rule engine score
    const finalRiskScore = status === 'Failed' 
      ? ruleResult.score 
      : Math.round((ruleResult.score + aiRiskScore) / 2);

    // 4. Determine Risk Level
    let riskLevel = 'Low';
    if (finalRiskScore >= 75) riskLevel = 'High';
    else if (finalRiskScore >= 40) riskLevel = 'Medium';

    // 5. Save to MongoDB
    const scanRecord = await Scan.create({
      user: req.user._id,
      messageText,
      ruleEngineScore: ruleResult.score,
      riskScore: finalRiskScore,
      riskLevel,
      scamCategory: ruleResult.category,
      aiCategory,
      aiExplanation,
      reasons: ruleResult.reasons,
      safetyRecommendations,
      status
    });

    // 6. Return response
    res.status(201).json({
      ruleEngineScore: scanRecord.ruleEngineScore,
      riskScore: scanRecord.riskScore,
      riskLevel: scanRecord.riskLevel,
      scamCategory: scanRecord.scamCategory,
      aiCategory: scanRecord.aiCategory,
      aiExplanation: scanRecord.aiExplanation,
      reasons: scanRecord.reasons,
      safetyRecommendations: scanRecord.safetyRecommendations,
      status: scanRecord.status
    });

  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: error.message,
    });
  }
};

// @desc    Get logged in user's scan history
// @route   GET /api/scan/history
// @access  Private
const getScanHistory = async (req, res) => {
  try {
    const history = await Scan.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch history' });
  }
};

export { analyzeScam, getScanHistory };