import fetch from 'node-fetch';

const FIGMA_API_BASE = 'https://api.figma.com/v1';

export type FigmaNode = {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
  absoluteBoundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  characters?: string;
};

export type FigmaNodesResponse = {
  nodes: Record<
    string,
    {
      document: FigmaNode;
      components?: Record<string, unknown>;
    }
  >;
};

const ensureToken = () => {
  const token = process.env.FIGMA_PERSONAL_ACCESS_TOKEN;
  if (!token) {
    throw new Error(
      'FIGMA_PERSONAL_ACCESS_TOKEN is not set. Please add it to your .env file.',
    );
  }
  return token;
};

export async function fetchFigmaNode(fileKey: string, nodeId: string) {
  const token = ensureToken();
  const url = `${FIGMA_API_BASE}/files/${fileKey}/nodes?ids=${encodeURIComponent(
    nodeId,
  )}`;

  const response = await fetch(url, {
    headers: {
      'X-Figma-Token': token,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Figma API error (${response.status}): ${errorText}`);
  }

  const data = (await response.json()) as FigmaNodesResponse;
  return data;
}

