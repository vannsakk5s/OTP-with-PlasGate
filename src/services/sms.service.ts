import axios from 'axios';

export const sendOtpViaPlasgate = async (phoneNumber: string, otpCode: string): Promise<boolean> => {
    const privateKey = process.env.PLASGATE_PRIVATE_KEY;
    const secretKey = process.env.PLASGATE_SECRET;
    const senderId = process.env.PLASGATE_SENDER || 'SMS Info';

    // ប្តូរលេខទូរស័ព្ទទៅជាទម្រង់ 855 (ឧទាហរណ៍ 012345678 -> 85512345678)
    let formattedPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (formattedPhone.startsWith('0')) {
        formattedPhone = '855' + formattedPhone.slice(1);
    }

    // message text sent to user
    const messageContent = `លេខកូដផ្ទៀងផ្ទាត់របស់អ្នកគឺ #ma#${otpCode}#ma# សូមកុំចែករំលែកកូដនេះទៅកាន់អ្នកដទៃ។`;
    const url = `https://cloudapi.plasgate.com/rest/send?private_key=${privateKey}`;

    try {
        const response = await axios.post(url, {
            sender: senderId,
            to: formattedPhone,
            content: messageContent
        }, {
            headers: {
                'X-Secret': secretKey,
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ SMS បាញ់ចេញជោគជ័យ:', response.data);
        return true;
    } catch (error: any) {
        const errorMsg = error.response?.data || error.message;
        console.error('❌ បរាជ័យក្នុងការផ្ញើ SMS:', errorMsg);
        return false;
    }
};