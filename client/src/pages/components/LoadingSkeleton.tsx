const LoadingSkeleton = () => {
  return (
    <div className="mt-[8rem] xl:mt-0 lg:h-[52.125rem] p-[1.5rem] flex flex-col gap-7 rounded-[1rem] bg-white md:w-[40.0625rem] xl:w-[50.5rem] w-full">
      {/* Hero Section Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded-lg"></div>
        <div className="h-8 w-32 bg-gray-200 animate-pulse rounded-lg"></div>
      </div>

      {/* Links Container */}
      <div className="flex-1 overflow-y-auto py-[4rem] shadow-container flex flex-col gap-7 min-h-0">
        {/* Link Cards Skeleton */}
        {[1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className="bg-[#FAFAFA] p-[1.25rem] rounded-[0.75rem] animate-pulse"
          >
            {/* Link Card Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gray-300 rounded"></div>
                <div className="h-6 w-24 bg-gray-300 rounded"></div>
              </div>
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
            </div>

            {/* Platform Dropdown Skeleton */}
            <div className="flex flex-col gap-3 mt-4">
              <div className="h-5 w-20 bg-gray-300 rounded"></div>
              <div className="h-12 w-full bg-gray-300 rounded-[0.5rem]"></div>
            </div>

            {/* URL Input Skeleton */}
            <div className="flex flex-col gap-3 mt-4">
              <div className="h-5 w-16 bg-gray-300 rounded"></div>
              <div className="h-12 w-full bg-gray-300 rounded-[0.5rem]"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="mt-auto pt-4 w-full">
        <hr className="border-gray-200" />
        <div className="flex md:justify-end">
          <div className="mt-4 h-10 w-32 bg-gray-200 animate-pulse rounded-lg md:w-24"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
