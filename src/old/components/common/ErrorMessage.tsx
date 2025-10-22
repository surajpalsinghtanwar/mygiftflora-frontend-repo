interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div className="flex justify-center items-center py-20">
    <div className="text-xl font-semibold text-red-500 bg-red-100 p-4 rounded-lg">
      Error: {message}
    </div>
  </div>
);