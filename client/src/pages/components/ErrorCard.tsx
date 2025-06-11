interface ErrorCardProps {
  message: string;
  retry?: () => void;
}

const ErrorCard = ({ message, retry }: ErrorCardProps) => {
  return (
    <div className="flex flex-col h-svh items-center justify-center p-8 bg-white rounded-lg shadow-md">
      <h2 className="mb-2 text-xl font-semibold text-gray-800">
        Something went wrong
      </h2>
      <p className="mb-4 text-center text-gray-600">{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="px-4 py-2 text-white bg-[#633CFF] rounded-lg hover:opacity-80 transition-opacity"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorCard;
