# ScamShield AI

ScamShield AI is an intelligent web application designed to analyze text, emails, and SMS messages to detect potential scams, phishing attempts, and fraud using a dual-layer detection approach (a local Rule Engine + Google Gemini AI).

## Overview
Built with the MERN stack (MongoDB, Express, React, Node.js), this project serves as a robust foundation for building AI-integrated security tools. It features full JWT-based authentication, a clean and modern user interface, and historical scan tracking.

## Tech Stack
- **Frontend:** React, Vite, React Router DOM, Axios, Plain CSS
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Authentication:** JSON Web Tokens (JWT), bcryptjs
- **AI Integration:** Google Generative AI (Gemini 1.5 Flash)

## Folder Structure
```text
ScamShield-AI/
├── client/                 # React Frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable UI components (Navbar, RiskCard)
│       ├── context/        # React Context API (AuthContext)
│       ├── pages/          # Full page views (Login, Dashboard)
│       └── services/       # API configuration (Axios)
└── server/                 # Node.js Backend
    ├── config/             # Database connection
    ├── controllers/        # Business logic (authController, scanController)
    ├── middleware/         # Custom middleware (auth, error handling)
    ├── models/             # Mongoose schemas (User, Scan)
    ├── routes/             # API endpoints
    └── utils/              # Helper functions (Rule Engine, JWT generation)
```

## Features
- **Secure Authentication:** User signup and login with hashed passwords.
- **Protected Routes:** Both frontend UI and backend API endpoints are secured.
- **Dual-Layer Scam Detection:**
  1. *Rule Engine:* Instantly flags suspicious keywords (OTP, KYC, Lottery) and shady domains.
  2. *AI Analysis:* Calls Gemini AI for deep context analysis and explanations.
- **Scan History:** Users can securely view their past scanned messages.
- **Modern UI:** Responsive, minimalist, fast, and accessible design without heavy CSS frameworks.

## Installation

### Prerequisites
- Node.js installed
- MongoDB installed and running locally on port 27017

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd ScamShield-AI
```

### 2. Backend Setup
```bash
cd server
npm install
```
Rename `.env.example` to `.env` and fill in your keys (especially `GEMINI_API_KEY`).
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
npm run dev
```

## Environment Variables
**Server (`server/.env`)**
- `PORT` = 5000
- `MONGO_URI` = mongodb://localhost:27017/scamshield
- `JWT_SECRET` = your_super_secret_jwt_key
- `GEMINI_API_KEY` = your_google_gemini_api_key

**Client (`client/.env`)** *(Optional for Vite)*
- `VITE_API_URL` = http://localhost:5000/api

## Future Improvements
- Add OAuth (Google/Github login)
- Implement email verification and password reset workflows
- Add real-time dark mode toggle
- Expand the rule engine with a wider set of RegEx patterns
- Provide a Chrome Extension frontend for auto-scanning web pages
