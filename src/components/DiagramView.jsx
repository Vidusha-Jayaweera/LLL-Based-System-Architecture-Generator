import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    primaryColor: '#6366f1',
    primaryTextColor: '#fff',
    primaryBorderColor: '#4f46e5',
    lineColor: '#94a3b8',
    secondaryColor: '#f1f5f9',
    tertiaryColor: '#e2e8f0',
    background: '#ffffff',
    mainBkg: '#6366f1',
    nodeBorder: '#4f46e5',
    clusterBkg: '#f8fafc',
    titleColor: '#1e293b',
    edgeLabelBackground: '#f1f5f9',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  flowchart: { curve: 'basis', padding: 20 },
  securityLevel: 'loose',
});

/**
 * Build a Mermaid flowchart from components array
 */
const buildMermaidCode = (components = [], pattern = '') => {
  if (!components.length) return null;

  const sanitize = (str) => str.replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 20);

  const nodes = components.map((c, i) => {
    const id = sanitize(c.name || `node${i}`);
    const label = (c.name || 'Component').slice(0, 25);
    const type = (c.type || '').toLowerCase();

    if (type.includes('database') || type.includes('db')) return `  ${id}[(${label})]`;
    if (type.includes('queue') || type.includes('message')) return `  ${id}{{${label}}}`;
    if (type.includes('gateway') || type.includes('proxy')) return `  ${id}{${label}}`;
    return `  ${id}[${label}]`;
  });

  // Build simple left-to-right flow
  const ids = components.map((c, i) => sanitize(c.name || `node${i}`));
  const edges = ids.slice(0, -1).map((id, i) => `  ${id} --> ${ids[i + 1]}`);

  return `flowchart LR\n${nodes.join('\n')}\n${edges.join('\n')}`;
};

const DiagramView = ({ data }) => {
  const containerRef = useRef(null);
  const [svgContent, setSvgContent] = useState('');
  const [error, setError] = useState(false);

  const diagramCode = data?.architecture_diagram_code
    || buildMermaidCode(data?.architectural_components, data?.architectural_pattern);

  useEffect(() => {
    if (!diagramCode || !containerRef.current) return;

    const render = async () => {
      try {
        const id = `mermaid-${Date.now()}`;
        const { svg } = await mermaid.render(id, diagramCode);
        setSvgContent(svg);
        setError(false);
      } catch (e) {
        console.error('Mermaid render error:', e);
        setError(true);
      }
    };

    render();
  }, [diagramCode]);

  if (!diagramCode) return null;

  return (
    <div className="card animate-slide-up">
      <div className="flex items-center justify-between mb-5">
        <h2 className="section-title">
          <span className="text-xl">🗺️</span>
          Architecture Diagram
        </h2>
        {diagramCode && (
          <button
            onClick={() => navigator.clipboard.writeText(diagramCode)}
            className="btn-secondary text-xs"
            title="Copy Mermaid code"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy Mermaid
          </button>
        )}
      </div>

      {error ? (
        /* Fallback: simple text flow */
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 overflow-x-auto">
          <div className="flex flex-wrap items-center gap-2 justify-center">
            {(data?.architectural_components || []).map((c, i, arr) => (
              <div key={i} className="flex items-center gap-2">
                <div className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap">
                  {c.name}
                </div>
                {i < arr.length - 1 && (
                  <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : svgContent ? (
        <div
          ref={containerRef}
          className="bg-white dark:bg-gray-800/30 rounded-xl p-4 overflow-x-auto border border-gray-100 dark:border-gray-800"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      ) : (
        <div className="skeleton h-40 w-full" />
      )}
    </div>
  );
};

export default DiagramView;
