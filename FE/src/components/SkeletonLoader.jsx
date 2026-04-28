const SkeletonLoader = () => (
  <div className="space-y-6 animate-fade-in">
    {/* Pattern skeleton */}
    <div className="card">
      <div className="skeleton h-5 w-40 mb-4 rounded-lg" />
      <div className="skeleton h-10 w-64 rounded-xl" />
    </div>

    {/* Diagram skeleton */}
    <div className="card">
      <div className="skeleton h-5 w-48 mb-4 rounded-lg" />
      <div className="skeleton h-40 w-full rounded-xl" />
    </div>

    {/* Components skeleton */}
    <div className="card">
      <div className="skeleton h-5 w-44 mb-5 rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card border border-gray-100 dark:border-gray-800 space-y-3">
            <div className="flex justify-between">
              <div className="skeleton h-4 w-28 rounded" />
              <div className="skeleton h-5 w-16 rounded-full" />
            </div>
            <div className="skeleton h-3 w-full rounded" />
            <div className="skeleton h-3 w-4/5 rounded" />
          </div>
        ))}
      </div>
    </div>

    {/* Rationale skeleton */}
    <div className="card">
      <div className="skeleton h-5 w-36 mb-5 rounded-lg" />
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="skeleton h-8 w-8 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-32 rounded" />
              <div className="skeleton h-3 w-full rounded" />
              <div className="skeleton h-3 w-3/4 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SkeletonLoader;
