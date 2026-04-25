import express from 'express';
import dotenv from 'dotenv';
import otpRoutes from './src/routes/otp.routes';

import cors from 'cors';

// Load អថេរពីឯកសារ .env
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// អនុញ្ញាតឲ្យ Frontend ទាក់ទងមកបាន
app.use(cors());

// អនុញ្ញាតឲ្យ Express អានទិន្នន័យជា JSON
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ status: 'ok' });
});

// ភ្ជាប់ Routes
app.use('/api/otp', otpRoutes);

// បង្កើត Function ដើម្បីបើក Server
const startServer = async () => {
    try {
        app.listen(port, () => {
            console.log(`🚀 Server កំពុងដំណើរការនៅលើ http://localhost:${port} (In-Memory Mode)`);
        });
    } catch (error) {
        console.error('❌ បរាជ័យក្នុងការចាប់ផ្តើម Server:', error);
    }
};

startServer();