# OTP-with-PlasGate

## 1. Setup Project

Install dependencies:

npm install


2. Configure Environment Variables
Create a .env file in the backend folder:

Copy the variables from .env.example to .env and fill in your actual values.

.env

PLASGATE_PRIVATE_KEY=your_plasgate_private_key
PLASGATE_SECRET=your_plasgate_secret
PLASGATE_SENDER=YourSenderName
PORT=3000


3. Run the Server
Start the development server:

npm run dev

The server will start on http://localhost:3000.

4. Testing

Request OTP:

POST http://localhost:3000/api/otp/request

Body:

{
    "phone": "012345678"
}


Verify OTP:

POST http://localhost:3000/api/otp/verify

Body:

{
    "phone": "012345678",
    "code": "123456"
}
