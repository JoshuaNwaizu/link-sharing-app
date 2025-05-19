const LoadingSkeleton = () => {
  return (
    <div className="mt-[8rem] xl:mt-0 lg:h-[52.125rem] p-[1.5rem] flex flex-col gap-7 rounded-[1rem] bg-white md:w-[40.0625rem] xl:w-[50.5rem] w-full">
      {/* Hero section skeleton */}
      <div className="h-16 bg-gray-200 animate-pulse rounded-lg"></div>

      {/* Links container skeleton */}
      <div className="flex-1 overflow-y-auto py-[4rem] shadow-container flex flex-col gap-7 min-h-0">
        {/* Generate 3 loading link cards */}
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="h-[4rem] bg-gray-200 animate-pulse rounded-lg"
          ></div>
        ))}
      </div>

      {/* Button skeleton */}
      <div className="mt-auto pt-4 w-full">
        <hr className="border-gray-200" />
        <div className="flex md:justify-end">
          <div className="mt-4 h-[2.75rem] w-full md:w-[5rem] bg-gray-200 animate-pulse rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
