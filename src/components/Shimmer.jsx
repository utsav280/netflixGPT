import React from "react";

const Shimmer = ({ title }) => {
  return (
    <div className="px-6 md:px-10 py-5">
      {/* Title skeleton */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-6 rounded-full shimmer-bg" />
        <div className="h-5 w-36 rounded-lg shimmer-bg" />
      </div>

      {/* Card skeletons */}
      <div className="flex gap-3 overflow-x-hidden">
        {Array(7)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="min-w-[160px] md:min-w-[185px] h-60 md:h-72 rounded-lg shimmer-bg flex-shrink-0"
              style={{ opacity: 1 - i * 0.1 }}
            />
          ))}
      </div>
    </div>
  );
};

export default Shimmer;
