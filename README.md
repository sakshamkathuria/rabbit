# 📊 Sales Insight Automator

AI-powered sales data summarizer. Upload a CSV/XLSX file → Gemini generates
an executive summary → delivered to your inbox via email.

---

## 🚀 Quick Start (Docker)

### 1. Clone the repo
git clone https://github.com/your-username/sales-insight-automator
cd sales-insight-automator

### 2. Set up environment
cp .env.example .env
# Fill in your actual values in .env

### 3. Run the full stack
docker compose up --build

- Frontend → http://localhost:3000
- Backend  → http://localhost:8000
- Swagger  → http://localhost:8000/docs

---

## 🔐 Security Overview

| Layer          | Implementation                                      |
|----------------|-----------------------------------------------------|
| Authentication | X-API-Key header required on all /api/* routes      |
| Rate Limiting  | 5 requests per IP per minute via express-rate-limit |
| File Validation| Only .csv/.xlsx accepted, max 5MB enforced          |
| CORS           | Only whitelisted origins allowed                    |
| HTTP Headers   | Helmet.js sets secure response headers              |

---

## 🧰 Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend:  Node.js + Express.js
- AI:       Google Gemini 1.5 Flash
- Email:    Nodemailer + SMTP (Gmail)
- Docs:     Swagger UI at /docs
- DevOps:   Docker, Docker Compose, GitHub Actions
- Deploy:   Vercel (frontend), Render (backend)

---

## 🌐 Live URLs

- Frontend:  https://your-app.vercel.app
- Swagger:   https://your-backend.onrender.com/docs