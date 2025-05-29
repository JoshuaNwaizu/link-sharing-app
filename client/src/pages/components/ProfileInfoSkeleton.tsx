const ProfileInfoSkeleton = () => {
  return (
    <div className="flex flex-col mt-[4rem] md:rounded-[1.5rem] mx-auto w-full md:shadow-[0_0_32px_0_rgba(0,0,0,0.10)] md:bg-[#fff] items-center xl:w-[21rem] md:py-[3rem] md:px-[3.5rem] justify-center">
      <div className="flex flex-col w-[14.8125rem] gap-9">
        {/* Profile Image Skeleton */}
        <div className="flex items-center justify-center gap-3.5 flex-col">
          <div className="w-[6rem] h-[6rem] rounded-full bg-gray-200 animate-pulse"></div>

          {/* Name Skeleton */}
          <div className="flex gap-2">
            <div className="h-[3rem] w-[6rem] bg-gray-200 animate-pulse rounded-lg"></div>
            <div className="h-[3rem] w-[6rem] bg-gray-200 animate-pulse rounded-lg"></div>
          </div>

          {/* Email Skeleton */}
          <div className="h-[1.5rem] w-[10rem] bg-gray-200 animate-pulse rounded-lg"></div>
        </div>

        {/* Links Skeleton */}
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="h-[3.5rem] w-full bg-gray-200 animate-pulse rounded-lg"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoSkeleton;
