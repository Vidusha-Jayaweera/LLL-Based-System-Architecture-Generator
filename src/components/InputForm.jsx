import { useState } from 'react';

const EXAMPLES = [
  'Design a scalable e-commerce platform with payment processing',
  'Build a real-time chat application with 1 million users',
  'Design a microservices-based banking system',
  'Create a video streaming platform like Netflix',
];

const InputForm = ({ onSubmit, isLoading, onReset, hasResult }) => {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Please enter a system description before generating.');
      return;
    }
    setError('');
    onSubmit(prompt.trim());
  };

  const handleExample = (example) => {
    setPrompt(example);
    setError('');
  };

  const handleReset = () => {
    setPrompt('');
    setError('');
    onReset();
  };

  return (
    <div className="card animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.347a3.75 3.75 0 01-5.303 0l-.347-.347z" />
          </svg>
        </div>
        <div>
          <h2 className="font-bold text-gray-900 dark:text-white text-lg">Describe Your System</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">AI will generate a complete architecture design</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            className={`input-field min-h-[140px] text-sm leading-relaxed ${error ? 'border-red-400 focus:ring-red-400' : ''}`}
            placeholder="e.g. Design a scalable e-commerce platform with user authentication, product catalog, shopping cart, payment processing, and order management..."
            value={prompt}
            onChange={(e) => { setPrompt(e.target.value); setError(''); }}
            disabled={isLoading}
            rows={6}
          />
          {error && (
            <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          )}
        </div>

        {/* Example prompts */}
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Quick Examples</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleExample(ex)}
                disabled={isLoading}
                className="text-xs px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors duration-150 border border-indigo-200 dark:border-indigo-800 disabled:opacity-50"
              >
                {ex.length > 40 ? ex.slice(0, 40) + '…' : ex}
              </button>
            ))}
          </div>
        </div>

        {/* Char count + Actions */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-gray-400 dark:text-gray-600">{prompt.length} characters</span>
          <div className="flex gap-3">
            {hasResult && (
              <button type="button" onClick={handleReset} className="btn-secondary">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset
              </button>
            )}
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate Architecture
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InputForm;
