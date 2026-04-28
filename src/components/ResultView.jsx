import ComponentCard from './ComponentCard';
import DiagramView from './DiagramView';
import { downloadJSON, copyToClipboard } from '../utils/storage';
import toast from 'react-hot-toast';

const PATTERN_COLORS = {
  microservices:  'bg-blue-600',
  monolithic:     'bg-gray-600',
  serverless:     'bg-purple-600',
  'event-driven': 'bg-orange-600',
  layered:        'bg-teal-600',
  hexagonal:      'bg-pink-600',
  default:        'bg-indigo-600',
};

const getPatternColor = (pattern = '') => {
  const p = pattern.toLowerCase();
  return Object.entries(PATTERN_COLORS).find(([k]) => p.includes(k))?.[1] || PATTERN_COLORS.default;
};

const ResultView = ({ data, prompt }) => {
  if (!data) return null;

  const {
    architectural_pattern,
    architectural_components = [],
    rationale_for_components = [],
  } = data;

  const handleCopy = async () => {
    await copyToClipboard(data);
    toast.success('Copied to clipboard!');
  };

  const handleDownload = () => {
    downloadJSON({ prompt, result: data }, `architecture-${Date.now()}.json`);
    toast.success('Downloaded!');
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Architectural Pattern ── */}
      <div className="card animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">
            <span className="text-xl">🏛️</span>
            Architectural Pattern
          </h2>
          <div className="flex gap-2">
            <button onClick={handleCopy} className="btn-secondary">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy JSON
            </button>
            <button onClick={handleDownload} className="btn-secondary">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
          </div>
        </div>

        {architectural_pattern ? (
          <div className="flex items-center gap-3">
            <span className={`${getPatternColor(architectural_pattern)} text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm`}>
              {architectural_pattern}
            </span>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Recommended pattern for your system
            </p>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No pattern returned.</p>
        )}
      </div>

      {/* ── Diagram ── */}
      <DiagramView data={data} />

      {/* ── Components Grid ── */}
      {architectural_components.length > 0 && (
        <div className="card animate-slide-up">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">
              <span className="text-xl">🧩</span>
              Architectural Components
              <span className="ml-2 text-xs font-normal bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                {architectural_components.length}
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {architectural_components.map((component, i) => (
              <ComponentCard key={i} component={component} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* ── Rationale ── */}
      {rationale_for_components.length > 0 && (
        <div className="card animate-slide-up">
          <h2 className="section-title mb-5">
            <span className="text-xl">💡</span>
            Design Rationale
          </h2>
          <div className="space-y-4">
            {rationale_for_components.map((item, i) => (
              <div
                key={i}
                className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors duration-150 animate-slide-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center text-sm font-bold shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    {item.component || 'Component'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {item.rationale || 'No rationale provided.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultView;
