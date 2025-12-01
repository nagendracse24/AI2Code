<<<<<<< HEAD
# AI2Code - Figma to Code Generator

Convert Figma designs into production-ready React components using AI.

## Project Structure

```
AI2code/
├── backend/          # Node.js + Express + TypeScript API
│   └── src/
│       └── index.ts  # Express server entry point
└── frontend/         # React + Vite + TypeScript UI
    └── src/
        ├── App.tsx   # Main React component
        └── main.tsx  # React entry point
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `.env.example` if available):
   ```
   PORT=3001
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`

## Development Workflow

- **Backend**: Runs on port 3001, handles API requests
- **Frontend**: Runs on port 3000, proxies `/api/*` requests to backend

## Next Steps

Phase 1 is complete! Next we'll build:
- Phase 2: Basic input form with stubbed API response
- Phase 3: Real Figma API integration
- Phase 4: LLM-powered code generation
- Phase 5: Logging and evaluation

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Frontend**: React, Vite, TypeScript, TailwindCSS
- **Package Manager**: npm

=======
# AI2Code
AI2Code is an AI-assisted developer tool that converts Figma designs into clean, reusable **React + TailwindCSS** components.   It parses Figma JSON, extracts layout structure, infers UI semantics, and refines component output using LLMs.
# 🧩 AI2Code — AI-Powered Figma → React/Tailwind Generator

AI2Code is an AI-assisted developer tool that converts Figma designs into clean, reusable **React + TailwindCSS** components.  
It parses Figma JSON, extracts layout structure, infers UI semantics, and refines component output using LLMs.

> 🚧 **Status:** Version 1 under development — expected release: _next 7 days_

---

## 🚀 Features (v1)
- Convert Figma frames → React components
- Auto-detect layout (Flex/Grid) from Figma autolayout data
- Extract colors, spacing, typography as design tokens
- LLM-powered refinement for naming + accessibility hints
- Downloadable project scaffold (Vite/Next.js)

---

## 🛠️ Tech Stack
- **Frontend:** React, TypeScript, TailwindCSS  
- **Backend:** Node.js, Python, FastAPI  
- **AI:** OpenAI GPT-4/5, Prompt Engineering  
- **Utilities:** Prettier, ESLint  
- **Deployment:** Docker, Vercel/Render

---

## 🧱 Architecture (High-Level)
>>>>>>> dd727a2251fba9b719359b826e1eb84a2c96dc2e
