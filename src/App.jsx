import { useState, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import InputForm from './components/InputForm';
import ResultView from './components/ResultView';
import SkeletonLoader from './components/SkeletonLoader';
import HistoryPanel from './components/HistoryPanel';
import { generateArchitecture } from './services/api';
import { getHistory, saveToHistory, clearHistory } from './utils/storage';
import { useDarkMode } from './hooks/useDarkMode';

export default function App() {
  const [isDark, setIsDark] = useDarkMode();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [error, setError] = useState(null);
  const [history, setHistory] = useState(getHistory);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = useCallback(async (prompt) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setCurrentPrompt(prompt);

    const toastId = toast.loading('Generating architecture design…');

    try {
      const response = await generateArchitecture(prompt);

      if (!response?.success || !response?.data) {
        throw new Error('Invalid response from server.');
      }

      setResult(response.data);
      const updated = saveToHistory(prompt, response);
      setHistory(updated);
      toast.success('Architecture generated!', { id: toastId });
    } catch (err) {
      const msg = err?.response?.data?.message
        || err?.response?.data?.error
        || err?.message
        || 'Something went wrong. Please try again.';
      setError(msg);
      toast.error(msg, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setResult(null);
    setError(null);
    setCurrentPrompt('');
  }, []);

  const handleHistorySelect = useCallback((item) => {
    setCurrentPrompt(item.prompt);
    setResult(item.result?.data || null);
    setError(null);
    toast('Loaded from history', { icon: '🕐' });
  }, []);

  const handleClearHistory = useCallback(() => {
    clearHistory();
    setHistory([]);
    toast.success('History cleared');
  }, []);

  // Filter components by search query
  const filteredResult = result && searchQuery.trim()
    ? {
        ...result,
        architectural_components: (result.architectural_components || []).filter(c =>
          c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description?.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        rationale_for_components: (result.rationale_for_components || []).filter(r =>
          r.component?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.rationale?.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }
    : result;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-white text-sm',
          duration: 3000,
        }}
      />

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white text-base leading-tight">
                AI Architecture Workbench
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                Software Architecture Design Assistant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Status indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : result ? 'bg-green-400' : 'bg-gray-300 dark:bg-gray-600'}`} />
              {isLoading ? 'Processing…' : result ? 'Ready' : 'Idle'}
            </div>

            {/* Dark mode toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors duration-200"
              title="Toggle dark mode"
            >
              {isDark ? (
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Hero text (only when no result) */}
        {!result && !isLoading && (
          <div className="text-center py-6 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
              Design Software Architecture
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600"> with AI</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
              Describe your system requirements and get a complete architectural design with components, patterns, and rationale.
            </p>
          </div>
        )}

        {/* Input Form */}
        <InputForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onReset={handleReset}
          hasResult={!!result}
        />

        {/* History */}
        {!isLoading && !result && (
          <HistoryPanel
            history={history}
            onSelect={handleHistorySelect}
            onClear={handleClearHistory}
          />
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="card border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 animate-slide-up">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900/40 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-red-700 dark:text-red-400 text-sm">Generation Failed</p>
                <p className="text-red-600 dark:text-red-300 text-sm mt-0.5">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && <SkeletonLoader />}

        {/* Search bar (only when result exists) */}
        {result && !isLoading && (
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="relative flex-1 max-w-sm">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Filter components…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-9 py-2 text-sm"
              />
            </div>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="btn-secondary text-xs">
                Clear
              </button>
            )}
            <span className="text-xs text-gray-400 dark:text-gray-600 hidden sm:block">
              {filteredResult?.architectural_components?.length || 0} components
            </span>
          </div>
        )}

        {/* Results */}
        {filteredResult && !isLoading && (
          <ResultView data={filteredResult} prompt={currentPrompt} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 dark:border-gray-800 py-6 text-center text-xs text-gray-400 dark:text-gray-600">
        AI Architecture Workbench — Powered by Flask API
      </footer>
    </div>
  );
}
