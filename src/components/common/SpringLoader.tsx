export default function SpringLoader() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-xl border border-blue-100 relative overflow-hidden w-full max-w-sm mx-auto">
        <div className="absolute -top-10 -right-10 w-24 sm:w-32 h-24 sm:h-32 bg-blue-50 rounded-full opacity-70"></div>
        <div className="absolute -bottom-10 -left-10 w-20 sm:w-24 h-20 sm:h-24 bg-blue-50 rounded-full opacity-70"></div>

        <div className="relative flex flex-col items-center gap-4 sm:gap-6">
          <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Loading
          </h2>

          <div className="flex items-center gap-3 sm:gap-5 py-2">
            <div
              className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 animate-bounce shadow-md shadow-blue-200"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 animate-bounce shadow-md shadow-blue-200"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 animate-bounce shadow-md shadow-blue-200"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>

          <p className="text-gray-500 text-xs sm:text-sm font-medium text-center px-2">
            Please wait while we load your content
          </p>
        </div>
      </div>
    </div>
  );
}
