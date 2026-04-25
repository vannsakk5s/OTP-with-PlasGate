import { Request, Response } from 'express';
import { sendOtpViaPlasgate } from '../services/sms.service';

// In-Memory Store ជំនួសឲ្យ Redis បណ្ដោះអាសន្ន
const otpStore = new Map<string, { code: string, expiresAt: number }>();

// API ស្នើសុំកូដ OTP
export const requestOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { phone } = req.body;
        if (!phone) {
            res.status(400).json({ success: false, message: 'សូមបញ្ចូលលេខទូរស័ព្ទ' });
            return;
        }

        // បង្កើតកូដចៃដន្យ ៦ ខ្ទង់
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // រក្សាទុកកូដក្នុង Memory រយៈពេល ៣ នាទី (180 វិនាទី)
        otpStore.set(`otp:${phone}`, {
            code: otpCode,
            expiresAt: Date.now() + 180 * 1000 // 3 minutes from now
        });

        // ហៅ Service ដើម្បីបាញ់សារតាម Plasgate
        const isSent = await sendOtpViaPlasgate(phone, otpCode);

        if (isSent) {
            res.status(200).json({ success: true, message: 'កូដ OTP ត្រូវបានផ្ញើដោយជោគជ័យ' });
        } else {
            res.status(500).json({ success: false, message: 'មានបញ្ហាក្នុងការផ្ញើសារ សូមសាកល្បងម្តងទៀត' });
        }
    } catch (error) {
        console.error('Error in requestOtp:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// API ផ្ទៀងផ្ទាត់កូដ OTP
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { phone, code } = req.body;
        if (!phone || !code) {
            res.status(400).json({ success: false, message: 'ទិន្នន័យមិនគ្រប់គ្រាន់ទេ' });
            return;
        }

        // ទាញកូដពី Memory មកប្រៀបធៀប
        const storedData = otpStore.get(`otp:${phone}`);

        if (!storedData || storedData.expiresAt < Date.now()) {
            if (storedData) otpStore.delete(`otp:${phone}`); // clear expired
            res.status(400).json({ success: false, message: 'កូដនេះបានផុតកំណត់ ឬអ្នកមិនទាន់បានស្នើសុំកូដទេ' });
            return;
        }

        if (storedData.code === code) {
            // បើកូដត្រូវ លុបវាចេញពី Memory វិញភ្លាមៗ
            otpStore.delete(`otp:${phone}`);
            res.status(200).json({ success: true, message: 'ផ្ទៀងផ្ទាត់ជោគជ័យ!' });
        } else {
            res.status(400).json({ success: false, message: 'លេខកូដមិនត្រឹមត្រូវទេ' });
        }
    } catch (error) {
        console.error('Error in verifyOtp:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};