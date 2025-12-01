import fetch from 'node-fetch';

type NormalizedNodeInput = {
  name: string;
  type: string;
  boundingBox?: {
    width: number;
    height: number;
  };
  text?: string;
  childCount: number;
};

type LLMGenerationResult = {
  prompt: string;
  code: string;
  model: string;
  durationMs: number;
  source: 'mock' | 'openai';
};

const buildPrompt = (node: NormalizedNodeInput) => {
  const lines = [
    'You are an expert React + Tailwind UI generator.',
    'Produce a single functional component.',
    '',
    `Node name: ${node.name}`,
    `Node type: ${node.type}`,
    `Children detected: ${node.childCount}`,
  ];

  if (node.boundingBox) {
    lines.push(
      `Approx dimensions: ${Math.round(node.boundingBox.width)}x${Math.round(
        node.boundingBox.height,
      )}px`,
    );
  }

  if (node.text) {
    lines.push(`Reference text: """${node.text}"""`);
  }

  lines.push(
    '',
    'Requirements:',
    '- Use React + TypeScript + Tailwind.',
    '- Keep props minimal (title, description, actions).',
    '- Use semantic HTML and accessible labels.',
  );

  return lines.join('\n');
};

export async function generateComponentFromNode(
  node: NormalizedNodeInput | null,
): Promise<LLMGenerationResult> {
  const start = Date.now();

  const openAiKey = process.env.OPENAI_API_KEY;
  const openAiModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  if (!node) {
    return {
      prompt: 'No node provided.',
      code: '// Missing design data. Provide a valid node to synthesize UI.',
      model: 'mock',
      durationMs: Date.now() - start,
      source: 'mock',
    };
  }

  const prompt = buildPrompt(node);

  if (openAiKey) {
    try {
      const completionResponse = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openAiKey}`,
          },
          body: JSON.stringify({
            model: openAiModel,
            temperature: 0.3,
            messages: [
              {
                role: 'system',
                content:
                  'You are an expert React + TypeScript + Tailwind UI generator. Output only valid code within a markdown-style fenced block is not necessary; return pure code string.',
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
          }),
        },
      );

      if (!completionResponse.ok) {
        const errorText = await completionResponse.text();
        throw new Error(
          `OpenAI API ${completionResponse.status}: ${errorText}`,
        );
      }

      const completionJson = await completionResponse.json();
      const aiCode =
        completionJson.choices?.[0]?.message?.content?.trim() ||
        '// OpenAI response missing content.';

      return {
        prompt,
        code: aiCode,
        model: completionJson.model || openAiModel,
        durationMs: Date.now() - start,
        source: 'openai',
      };
    } catch (error) {
      console.error('OpenAI generation failed, reverting to mock output.', error);
    }
  }

  const mockCode = `import React from 'react';

type ${node.name.replace(/\W+/g, '') || 'Generated'}Props = {
  title?: string;
  description?: string;
  ctaLabel?: string;
};

export function ${node.name.replace(/\W+/g, '') || 'Generated'}({
  title = '${node.name}',
  description = '${node.text?.split('\n')[1] || 'AI-built component'}',
  ctaLabel = 'Launch',
}: ${node.name.replace(/\W+/g, '') || 'Generated'}Props) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-10 shadow-xl">
      <p className="text-sm font-semibold text-indigo-500 mb-3">AI2Code</p>
      <h1 className="text-4xl font-bold text-slate-900 mb-4">{title}</h1>
      <p className="text-lg text-slate-600 mb-8">{description}</p>
      <button className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-white">
        {ctaLabel}
      </button>
    </section>
  );
}`;

  return {
    prompt,
    code: mockCode,
    model: 'mock-draft',
    durationMs: Date.now() - start,
    source: 'mock',
  };
}

