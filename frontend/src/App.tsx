import React, { useState } from 'react';
import { LiveProvider, LivePreview, LiveError } from 'react-live';

type NormalizedNode = {
  id: string;
  name: string;
  type: string;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  text?: string;
  childCount: number;
};

type LLMResult = {
  prompt: string;
  code: string;
  model: string;
  durationMs: number;
  source: 'mock' | 'openai';
};

type GenerateResponse = {
  status: string;
  mode: 'demo' | 'real';
  componentName: string;
  metadata: {
    source: string;
    nodeId?: string;
    generatedAt: string;
  };
  design: {
    nodeId: string | null;
    normalizedNode: NormalizedNode | null;
  };
  componentCode: string;
  llm: LLMResult;
};

const featureHighlights = [
  {
    title: 'Figma-native parsing',
    description: 'Pull real nodes, constraints, and typography straight from your file.',
  },
  {
    title: 'LLM-ready schema',
    description: 'Normalize design JSON into a compact prompt format engineered for codegen.',
  },
  {
    title: 'Production output',
    description: 'Generate React + Tailwind blocks with copy + download in one click.',
  },
];

function App() {
  const [figmaUrl, setFigmaUrl] = useState('');
  const [fileKey, setFileKey] = useState('');
  const [nodeId, setNodeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');
  const [codeTab, setCodeTab] = useState<'baseline' | 'llm' | 'preview'>('baseline');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ figmaUrl, fileKey, nodeId }),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      const data: GenerateResponse = await response.json();
      setResult(data);
      setCodeTab('llm');
    } catch (err) {
      setError('Could not generate code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const activeCode =
    codeTab === 'llm' ? result?.llm?.code ?? result?.componentCode : result?.componentCode;

  const handleCopyCode = async () => {
    if (!activeCode) {
      return;
    }
    try {
      await navigator.clipboard.writeText(activeCode);
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 2000);
    } catch (err) {
      console.error(err);
      setCopyState('idle');
      setError('Copy failed. You can still select the code manually.');
    }
  };

  const handleDownloadCode = () => {
    if (!result || !activeCode) {
      return;
    }
    const blob = new Blob([activeCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${result.componentName || 'AI2CodeComponent'}.tsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generationState = loading ? 'processing' : result ? 'ready' : 'idle';

  const timeline = [
    {
      title: 'Inputs captured',
      detail:
        figmaUrl || fileKey || nodeId
          ? 'Figma reference detected.'
          : 'Provide URL or fileKey + nodeId.',
      status:
        loading || result
          ? 'completed'
          : figmaUrl || fileKey || nodeId
            ? 'active'
            : 'idle',
    },
    {
      title: 'Figma fetch',
      detail:
        result?.mode === 'real'
          ? 'Live node retrieved.'
          : 'Skipped (demo mode).',
      status:
        result?.mode === 'real'
          ? 'completed'
          : loading
            ? 'active'
            : 'idle',
    },
    {
      title: 'Design normalization',
      detail: result?.design?.normalizedNode
        ? 'Node transformed to AI schema.'
        : 'Awaiting response.',
      status: result?.design?.normalizedNode
        ? 'completed'
        : loading
          ? 'active'
          : 'idle',
    },
    {
      title: 'Component synthesis',
      detail: result
        ? `${result.componentName} ready.`
        : loading
          ? 'LLM drafting component...'
          : 'Run the pipeline to generate code.',
      status: result ? 'completed' : loading ? 'active' : 'idle',
    },
  ];

  const showSkeleton = loading && !result;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.4),_transparent_65%)] blur-3xl opacity-70" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />

      <div className="relative max-w-6xl mx-auto px-6 py-12 space-y-12">
        <section className="grid gap-10 lg:grid-cols-2 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-1 text-sm uppercase tracking-widest text-indigo-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live AI build pipeline
            </div>
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-white">
                Design-to-code, reimagined for{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-300 bg-clip-text text-transparent">
                  AI-native teams
                </span>
              </h1>
              <p className="text-lg text-slate-300">
                Pipe any Figma node into AI2Code and receive production-grade React + Tailwind. Every step is
                observable—inputs, normalized schema, LLM prompt, and final code.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#generator"
                  className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                  Try the live demo
                </a>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 border border-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:border-white/40 transition"
                >
                  Connect Figma workspace
                </button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {featureHighlights.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur"
                >
                  <p className="text-sm uppercase tracking-wide text-indigo-200">{feature.title}</p>
                  <p className="text-sm text-slate-300 mt-2">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">Current state</p>
                <p className="text-2xl font-semibold text-white">
                  {generationState === 'processing'
                    ? 'Generating…'
                    : result
                      ? result.componentName
                      : 'Awaiting input'}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  result?.mode === 'real'
                    ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40'
                    : 'bg-indigo-500/20 text-indigo-200 border border-indigo-400/40'
                }`}
              >
                {result?.mode === 'real' ? 'Live Figma' : 'Demo mode'}
              </span>
            </div>
            <div className="rounded-2xl bg-slate-900/60 border border-white/5 p-6 space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Pipeline health
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-semibold text-white">
                    {result?.design?.normalizedNode?.childCount ?? '—'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Nodes tracked</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold text-white">
                    {result ? '✔︎' : loading ? '…' : '—'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Normalizer</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold text-white">
                    {result ? 'React' : '—'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Output stack</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/5 p-4 bg-gradient-to-br from-slate-900 to-slate-800">
              <p className="text-sm text-slate-300">
                Ship-ready React + Tailwind components in minutes instead of days. Observability-first workflow for AI
                builders.
              </p>
            </div>
          </div>
        </section>

        <section
          id="generator"
          className="grid gap-8 lg:grid-cols-[420px,1fr] items-start"
        >
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">Input console</p>
              <h2 className="text-2xl font-semibold text-white mt-2">Link your Figma node</h2>
            </div>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-slate-200">
                Figma URL
                <input
                  type="url"
                  value={figmaUrl}
                  onChange={(e) => setFigmaUrl(e.target.value)}
                  placeholder="https://www.figma.com/file/..."
                  className="mt-2 w-full rounded-2xl bg-slate-900/60 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-medium text-slate-200">
                  File key
                  <input
                    type="text"
                    value={fileKey}
                    onChange={(e) => setFileKey(e.target.value)}
                    placeholder="abc123XYZ"
                    className="mt-2 w-full rounded-2xl bg-slate-900/60 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-200">
                  Node ID
                  <input
                    type="text"
                    value={nodeId}
                    onChange={(e) => setNodeId(e.target.value)}
                    placeholder="45:67"
                    className="mt-2 w-full rounded-2xl bg-slate-900/60 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 px-4 py-3 text-white font-semibold shadow-lg shadow-indigo-500/40 hover:opacity-90 transition disabled:opacity-60"
              >
                {loading ? 'Synthesizing UI…' : 'Generate component'}
              </button>
            </form>

            {error && (
              <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
                {error}
              </div>
            )}

            <div className="rounded-2xl border border-white/10 p-4 text-sm text-slate-300 bg-slate-900/40">
              <p className="font-semibold text-white mb-1">Need help?</p>
              Paste a full sharing URL or manually set the file key + node id. Without a Figma token the system stays in
              demo mode.
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">Generation timeline</p>
                  <h2 className="text-xl font-semibold text-white mt-2">Command log</h2>
                </div>
                <span className="text-sm text-slate-400">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="space-y-4">
                {timeline.map((step) => (
                  <div
                    key={step.title}
                    className="flex items-start gap-3"
                  >
                    <span
                      className={`w-3 h-3 mt-1 rounded-full ${
                        step.status === 'completed'
                          ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]'
                          : step.status === 'active'
                            ? 'bg-indigo-400 animate-pulse'
                            : 'bg-slate-600'
                      }`}
                    />
                    <div>
                      <p className="text-sm font-semibold text-white">{step.title}</p>
                      <p className="text-sm text-slate-400">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-500/20 overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-100">
                <div>
                  <p className="text-sm uppercase tracking-wide text-slate-500">Generated component</p>
                  <h3 className="text-2xl font-semibold text-slate-900">
                    {result?.componentName || 'Awaiting generation'}
                  </h3>
                  <p className="text-sm text-slate-500">
                    Source:{' '}
                    {result?.metadata?.source ? result.metadata.source : figmaUrl || 'Not provided'}
                  </p>
                </div>
                {result && (
                  <div className="flex gap-2 bg-slate-100 rounded-full p-1">
                    <button
                      type="button"
                      onClick={() => setCodeTab('baseline')}
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        codeTab === 'baseline'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-500'
                      }`}
                    >
                      Baseline stub
                    </button>
                    <button
                      type="button"
                      onClick={() => setCodeTab('llm')}
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        codeTab === 'llm'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-500'
                      }`}
                    >
                      AI draft
                    </button>
                    <button
                      type="button"
                      onClick={() => setCodeTab('preview')}
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        codeTab === 'preview'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-500'
                      }`}
                    >
                      Live preview
                    </button>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    disabled={!activeCode}
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:border-slate-300 disabled:opacity-40"
                  >
                    {copyState === 'copied' ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadCode}
                    disabled={!activeCode}
                    className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-40"
                  >
                    Download
                  </button>
                </div>
              </div>

              <div className="relative bg-slate-950 text-slate-100 font-mono text-sm p-6 overflow-auto min-h-[260px]">
                {showSkeleton ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-3 bg-white/10 rounded" />
                    <div className="h-3 bg-white/10 rounded w-11/12" />
                    <div className="h-3 bg-white/10 rounded w-9/12" />
                    <div className="h-3 bg-white/10 rounded w-5/12" />
                    <div className="h-3 bg-white/10 rounded w-8/12" />
                  </div>
                ) : codeTab === 'preview' && activeCode ? (
                  <div className="bg-white rounded-2xl p-8 min-h-[220px]">
                    <LiveProvider code={activeCode} scope={{ React }}>
                      <LivePreview className="text-slate-900" />
                      <LiveError className="mt-4 text-red-400 text-xs" />
                    </LiveProvider>
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap">
                    {activeCode ||
                      '// Submit a Figma reference to synthesize React + Tailwind.'}
                  </pre>
                )}
              </div>
            </div>

            {result?.llm && (
              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">LLM prompt</p>
                    <h3 className="text-xl font-semibold text-white mt-1">
                      {result.llm.model === 'mock-draft' ? 'Mock synthesis' : result.llm.model}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-400">
                    Duration: {result.llm.durationMs}ms · Source: {result.llm.source}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-950/80 border border-white/10 p-4 overflow-auto text-xs text-slate-200 font-mono max-h-64">
                  <pre className="whitespace-pre-wrap">{result.llm.prompt}</pre>
                </div>
              </div>
            )}

            {result?.design?.normalizedNode && (
              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">
                  Design node snapshot
                </p>
                <div className="grid gap-4 md:grid-cols-2 text-sm text-slate-200">
                  <div>
                    <p className="text-slate-400">Name</p>
                    <p className="font-semibold text-white">{result.design.normalizedNode.name}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Type</p>
                    <p className="font-semibold text-white">{result.design.normalizedNode.type}</p>
                  </div>
                  {result.design.normalizedNode.boundingBox && (
                    <div>
                      <p className="text-slate-400">Dimensions</p>
                      <p className="font-semibold text-white">
                        {Math.round(result.design.normalizedNode.boundingBox.width)}px ×{' '}
                        {Math.round(result.design.normalizedNode.boundingBox.height)}px
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-slate-400">Children</p>
                    <p className="font-semibold text-white">{result.design.normalizedNode.childCount}</p>
                  </div>
                </div>
                {result.design.normalizedNode.text && (
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Text sample</p>
                    <p className="text-white text-sm leading-relaxed">
                      {result.design.normalizedNode.text}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;

