import { Router } from 'express';
import { requestOtp, verifyOtp } from '../controllers/otp.controller';

const router = Router();

// បង្កើត Routes ទាំងពីរ
router.post('/request', requestOtp);
router.post('/verify', verifyOtp);

export default router;