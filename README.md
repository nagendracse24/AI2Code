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

