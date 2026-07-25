import express from 'express';
import { analyzeScam, getScanHistory } from '../controllers/scanController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/history', protect, getScanHistory);
router.post('/', protect, analyzeScam);

export default router;
