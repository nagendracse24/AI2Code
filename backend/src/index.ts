import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allow frontend to call this API
app.use(express.json()); // Parse JSON request bodies

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'AI2Code backend is running' });
});

// Demo generation endpoint for Phase 2
app.post('/api/generate', (req: Request, res: Response) => {
  const { figmaUrl, fileKey, nodeId } = req.body;

  console.log('[generate]', { figmaUrl, fileKey, nodeId });

  const responsePayload = {
    status: 'success',
    componentName: 'HeroSection',
    metadata: {
      source: figmaUrl || fileKey || 'unknown',
      nodeId: nodeId || 'root',
      generatedAt: new Date().toISOString(),
    },
    code: `import React from 'react';

type HeroSectionProps = {
  title: string;
  description: string;
  ctaLabel: string;
};

export function HeroSection({
  title = 'Design to Code in seconds',
  description = 'Paste a Figma URL and let AI generate production-ready React components.',
  ctaLabel = 'Get Started',
}: HeroSectionProps) {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-100 px-8 py-12">
      <div className="max-w-2xl">
        <p className="text-sm font-medium text-indigo-600 mb-3">AI2Code</p>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">{title}</h1>
        <p className="text-lg text-slate-600 mb-8">{description}</p>
        <button className="inline-flex items-center px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition">
          {ctaLabel}
        </button>
      </div>
    </section>
  );
}`,
  };

  res.json(responsePayload);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});

