import mongoose from 'mongoose';

const scanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    messageText: {
      type: String,
      required: true,
    },
    ruleEngineScore: {
      type: Number,
      required: true,
    },
    riskScore: {
      type: Number,
      required: true,
    },
    riskLevel: {
      type: String, // e.g., 'Low', 'Medium', 'High'
      required: true,
    },
    scamCategory: {
      type: String,
      required: true,
    },
    aiCategory: {
      type: String,
      required: true,
    },
    aiExplanation: {
      type: String,
      required: true,
    },
    reasons: {
      type: [String],
      required: true,
    },
    safetyRecommendations: {
      type: [String],
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'Success', // 'Success' or 'Failed'
    },
  },
  {
    timestamps: true,
  }
);

const Scan = mongoose.model('Scan', scanSchema);

export default Scan;
