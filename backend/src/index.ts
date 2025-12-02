import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fetchFigmaNode, fetchFigmaImage, FigmaNode } from './services/figmaClient';
import { generateComponentFromNode } from './services/llmGenerator';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'https://ai-2-code.vercel.app',
  process.env.FRONTEND_URL || '',
].filter(Boolean);

console.log('Allowed CORS origins:', allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      console.log('Request from origin:', origin);
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) {
        callback(null, true);
        return;
      }
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error('CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json()); // Parse JSON request bodies

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'AI2Code backend is running' });
});

const normalizeNode = (node: FigmaNode | undefined) => {
  if (!node) {
    return null;
  }

  const text =
    node.type === 'TEXT' && node.characters ? node.characters : undefined;

  return {
    id: node.id,
    name: node.name,
    type: node.type,
    boundingBox: node.absoluteBoundingBox,
    text,
    childCount: node.children?.length ?? 0,
  };
};

const buildDemoNode = () => ({
  id: 'demo-node',
  name: 'Hero Frame',
  type: 'FRAME',
  boundingBox: {
    x: 0,
    y: 0,
    width: 1200,
    height: 640,
  },
  text:
    'AI2Code\nDesign to Code in seconds\nPaste a Figma URL and let AI generate production-ready React components.',
  childCount: 3,
});

// Generation endpoint
app.post('/api/generate', async (req: Request, res: Response) => {
  const { figmaUrl, fileKey, nodeId } = req.body;

  console.log('[generate]', { figmaUrl, fileKey, nodeId });

  const canCallFigma =
    Boolean(process.env.FIGMA_PERSONAL_ACCESS_TOKEN) &&
    Boolean(fileKey) &&
    Boolean(nodeId);

  let normalizedNode: ReturnType<typeof normalizeNode> = null;
  let mode: 'demo' | 'real' = 'demo';
  let screenshotUrl: string | null = null;

  if (canCallFigma) {
    try {
      const [figmaResponse, imageUrl] = await Promise.all([
        fetchFigmaNode(fileKey, nodeId),
        fetchFigmaImage(fileKey, nodeId),
      ]);
      const nodeEntry = figmaResponse.nodes?.[nodeId];
      normalizedNode = normalizeNode(nodeEntry?.document as FigmaNode);
      screenshotUrl = imageUrl;
      mode = 'real';
    } catch (error) {
      console.error('Figma fetch failed, falling back to demo mode:', error);
    }
  }

  const llmResult = await generateComponentFromNode(
    normalizedNode || buildDemoNode(),
  );

  const responsePayload = {
    status: 'success',
    mode,
    componentName: 'HeroSection',
    metadata: {
      source: figmaUrl || fileKey || 'unknown',
      nodeId: nodeId || 'root',
      generatedAt: new Date().toISOString(),
    },
    design: {
      nodeId: normalizedNode?.id || nodeId || 'demo-node',
      normalizedNode: normalizedNode || buildDemoNode(),
      screenshotUrl: screenshotUrl,
    },
    componentCode: `import React from 'react';

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
    llm: llmResult,
  };

  res.json(responsePayload);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});

