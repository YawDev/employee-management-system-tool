import React from "react";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-teal-50 to-white py-16">
      <div className="relative">
        {/* Outer spinning ring - smaller */}
        <div className="w-10 h-10 border-3 border-teal-200 rounded-full animate-spin border-t-teal-600"></div>

        {/* Inner pulsing dot - smaller */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-teal-600 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Loading text */}
      <div className="mt-6 text-center">
        <p className="text-xl font-semibold text-gray-900 mb-2">Loading</p>
        <p className="text-gray-600">
          Please wait while we fetch your content...
        </p>
      </div>

      {/* Animated dots - bigger and more bouncy */}
      <div className="flex space-x-2 mt-4">
        <div className="w-4 h-4 bg-teal-600 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0s]"></div>
        <div className="w-4 h-4 bg-teal-600 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.2s]"></div>
        <div className="w-4 h-4 bg-teal-600 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.4s]"></div>
      </div>
    </div>
  );
};

export default Loader;
