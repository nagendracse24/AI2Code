# 🧩 AI2Code — AI-Powered Figma → React/Tailwind Generator

> **Design-to-code, reimagined for AI-native teams**

AI2Code converts Figma designs into production-ready **React + TypeScript + TailwindCSS** components. It parses Figma JSON, normalizes layout structure, and uses LLMs to generate clean, accessible UI code.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://your-vercel-url.vercel.app)
[![GitHub](https://img.shields.io/badge/github-AI2Code-blue)](https://github.com/nagendracse24/AI2Code)

---

## ✨ Features

- **Figma-native parsing** — Pull real nodes, constraints, and typography straight from your file
- **LLM-ready schema** — Normalize design JSON into a compact prompt format engineered for codegen
- **Production output** — Generate React + Tailwind blocks with copy + download in one click
- **Live preview** — See generated components rendered in real-time
- **Observable pipeline** — Full transparency into inputs, normalization, LLM prompts, and output
- **Demo & live modes** — Works without credentials; plug in tokens for real Figma + OpenAI integration

---

## 🏗️ Project Structure

```
AI2code/
├── backend/              # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── index.ts      # Express server entry point
│   │   └── services/
│   │       ├── figmaClient.ts    # Figma API integration
│   │       └── llmGenerator.ts   # OpenAI LLM integration
│   ├── package.json
│   └── tsconfig.json
├── frontend/             # React + Vite + TypeScript UI
│   ├── src/
│   │   ├── App.tsx       # Main application component
│   │   ├── main.tsx      # React entry point
│   │   └── index.css     # TailwindCSS imports
│   ├── package.json
│   └── vite.config.ts
├── vercel.json           # Vercel deployment config
├── DEPLOYMENT.md         # Detailed deployment guide
└── README.md             # This file
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- (Optional) Figma Personal Access Token for live mode
- (Optional) OpenAI API key for LLM-powered generation

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/nagendracse24/AI2Code.git
   cd AI2Code
   ```

2. **Backend setup**
   ```bash
   cd backend
   npm install
   cp env.example .env
   # Edit .env and add your keys (optional for demo mode)
   npm run dev
   ```
   Backend runs on `http://localhost:3001`

3. **Frontend setup** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend runs on `http://localhost:3000`

4. **Visit** `http://localhost:3000` and submit a Figma URL or use demo mode

---

## 🌐 Deployment

Deploy to production using Vercel (frontend) + Render (backend).

**👉 See [DEPLOYMENT.md](./DEPLOYMENT.md) for the complete step-by-step guide.**

Quick overview:
1. Deploy backend to Render (free tier)
2. Deploy frontend to Vercel (auto-deploy on push)
3. Set environment variables on each platform
4. Update CORS and API proxy URLs

---

## 🔧 Tech Stack

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **APIs**: Figma REST API, OpenAI Chat Completions
- **Tools**: dotenv, cors, node-fetch

### Frontend
- **Framework**: React 18 + TypeScript
- **Build tool**: Vite
- **Styling**: TailwindCSS
- **Code preview**: react-live
- **Deployment**: Vercel

---

## 📋 Environment Variables

### Backend (`backend/.env`)

```bash
PORT=3001
FRONTEND_URL=              # Your Vercel URL (for CORS in production)
FIGMA_PERSONAL_ACCESS_TOKEN=   # Optional: for live Figma mode
OPENAI_API_KEY=            # Optional: for LLM-powered generation
```

### Frontend

No environment variables required (proxies to backend via Vite/Vercel config).

---

## 🎯 Usage

1. **Demo mode** (no credentials needed)
   - Submit any Figma URL or leave fields empty
   - System returns a baseline component + mock AI draft

2. **Live Figma mode**
   - Add `FIGMA_PERSONAL_ACCESS_TOKEN` to backend `.env`
   - Enter a valid `fileKey` + `nodeId` from your Figma file
   - Backend fetches real node data and normalizes it

3. **AI-powered mode**
   - Add `OPENAI_API_KEY` to backend `.env`
   - System sends normalized schema to OpenAI
   - Returns LLM-generated React component

4. **Live preview**
   - Click the "Live preview" tab to see the component rendered in real-time

---

## 🤝 Contributing

This is a portfolio project, but suggestions and feedback are welcome! Open an issue or PR if you have ideas for improvements.

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details

---

## 👤 Author

**Nagendra Singh**  
Software Engineer | AI + Full-Stack Developer

- GitHub: [@nagendracse24](https://github.com/nagendracse24)
- Email: nagendracse24@gmail.com

---

## 🙏 Acknowledgments

- Figma API for design data access
- OpenAI for LLM-powered code generation
- React, Vite, TailwindCSS communities

---

Built with ❤️ by Nagendra Singh
