// Global loading state for the application
export default function Loading() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="m-auto max-w-7xl p-8">
        {/* Folder Filter Skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="h-5 w-48 bg-gray-200 rounded mb-2" />
          <div className="flex gap-2 flex-wrap">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 w-24 bg-gray-200 rounded" />
            ))}
          </div>
        </div>

        {/* Current Folder Info Skeleton */}
        <div className="mb-6 animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded mb-2" />
          <div className="h-5 w-32 bg-gray-200 rounded" />
        </div>

        {/* Collection View Skeleton */}
        <div className="mb-6 animate-pulse">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-10 w-28 bg-gray-200 rounded" />
            <div className="h-10 w-40 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-3 gap-12">
          {[...Array(21)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-96 animate-pulse" />
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex justify-center items-center gap-4 mt-8 animate-pulse">
          <div className="h-10 w-24 bg-gray-200 rounded" />
          <div className="h-6 w-32 bg-gray-200 rounded" />
          <div className="h-10 w-24 bg-gray-200 rounded" />
        </div>
      </main>
    </div>
  );
}

