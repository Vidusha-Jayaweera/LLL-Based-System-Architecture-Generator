import { formatDistanceToNow } from '../utils/time';

const HistoryPanel = ({ history, onSelect, onClear }) => {
  if (!history.length) return null;

  return (
    <div className="card animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">
          <span className="text-lg">🕐</span>
          Recent Prompts
        </h2>
        <button onClick={onClear} className="text-xs text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors">
          Clear all
        </button>
      </div>
      <div className="space-y-2">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="w-full text-left p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-150 group"
          >
            <p className="text-sm text-gray-800 dark:text-gray-200 font-medium truncate group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
              {item.prompt}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {formatDistanceToNow(item.timestamp)}
              </span>
              {item.result?.data?.architectural_pattern && (
                <span className="text-xs px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 rounded-full">
                  {item.result.data.architectural_pattern}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HistoryPanel;
