interface ErrorCardProps {
  message: string;
  retry?: () => void;
}

const ErrorCard = ({ message, retry }: ErrorCardProps) => {
  return (
    <div className="flex flex-col md:rounded-[1.5rem] mx-auto w-full md:shadow-[0_0_32px_0_rgba(0,0,0,0.10)] md:bg-[#fff] items-center xl:w-[21rem] md:py-[3rem] md:px-[3.5rem] justify-center">
      <div className="flex flex-col w-[14.8125rem] gap-9 items-center text-center">
        <div className="w-19 h-19 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
          ?
        </div>
        <h2 className="text-[1.5rem] font-bold text-[#333] leading-[2.25rem]">
          Something went wrong
        </h2>
        <p className="text-[#737373] leading-[1.5rem]">{message}</p>
        {retry && (
          <button
            onClick={retry}
            className="px-6 py-3 text-white bg-[#633CFF] rounded-lg hover:opacity-80 transition-opacity font-semibold"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorCard;
