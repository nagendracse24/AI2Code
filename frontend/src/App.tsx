import { useState } from 'react';

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
};

function App() {
  const [figmaUrl, setFigmaUrl] = useState('');
  const [fileKey, setFileKey] = useState('');
  const [nodeId, setNodeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResponse | null>(null);

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
    } catch (err) {
      setError('Could not generate code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          AI2Code
        </h1>
        <p className="text-gray-600 mb-10">
          Convert your Figma designs into production-ready React components.
        </p>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Figma URL
                <input
                  type="url"
                  value={figmaUrl}
                  onChange={(e) => setFigmaUrl(e.target.value)}
                  placeholder="https://www.figma.com/file/..."
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-medium text-gray-700">
                  File Key
                  <input
                    type="text"
                    value={fileKey}
                    onChange={(e) => setFileKey(e.target.value)}
                    placeholder="abc123XYZ"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  />
                </label>

                <label className="block text-sm font-medium text-gray-700">
                  Node ID
                  <input
                    type="text"
                    value={nodeId}
                    onChange={(e) => setNodeId(e.target.value)}
                    placeholder="45:67"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-white font-semibold hover:bg-indigo-500 disabled:opacity-60"
            >
              {loading ? 'Generating…' : 'Generate Code'}
            </button>
          </form>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700">
              {error}
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase text-gray-500 tracking-wide">
                    Generated Component
                  </p>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {result.componentName}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Mode: {result.mode === 'demo' ? 'Demo' : 'Live Figma'}
                  </p>
                </div>
                <div className="text-sm text-gray-500 text-right">
                  <p>Source: {result.metadata.source}</p>
                  <p>Node ID: {result.metadata.nodeId}</p>
                  <p>
                    Generated:{' '}
                    {new Date(result.metadata.generatedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {result.design?.normalizedNode && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-1 text-sm text-gray-700">
                  <p className="text-xs uppercase text-gray-500 tracking-wide">
                    Design Node Snapshot
                  </p>
                  <p>
                    <span className="font-semibold">Name:</span>{' '}
                    {result.design.normalizedNode.name}
                  </p>
                  <p>
                    <span className="font-semibold">Type:</span>{' '}
                    {result.design.normalizedNode.type}
                  </p>
                  {result.design.normalizedNode.boundingBox && (
                    <p>
                      <span className="font-semibold">Dimensions:</span>{' '}
                      {Math.round(result.design.normalizedNode.boundingBox.width)}px
                      ×{' '}
                      {Math.round(result.design.normalizedNode.boundingBox.height)}px
                    </p>
                  )}
                  {result.design.normalizedNode.text && (
                    <p>
                      <span className="font-semibold">Text:</span>{' '}
                      {result.design.normalizedNode.text}
                    </p>
                  )}
                  <p>
                    <span className="font-semibold">Children:</span>{' '}
                    {result.design.normalizedNode.childCount}
                  </p>
                </div>
              )}

              <div className="relative rounded-lg bg-gray-900 text-white font-mono text-sm p-5 overflow-auto">
                <pre className="whitespace-pre-wrap">{result.componentCode}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

