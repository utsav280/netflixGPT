import React from "react";

const Shimmer = ({ title }) => {
  return (
    <div className="px-8 py-4">
      <h1 className="text-2xl font-bold text-white mb-4">{title}</h1>
      <div className="flex space-x-4 overflow-x-scroll no-scrollbar">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="min-w-[200px] h-48 bg-gray-700 rounded-md shimmer"
            ></div>
          ))}
      </div>
      <style jsx="true">{`
        .shimmer {
          background: linear-gradient(
            to right,
            #2a2a2a 8%,
            #3a3a3a 18%,
            #2a2a2a 33%
          );
          background-size: 1000px 100%;
          animation: shimmer 1.5s infinite linear;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, and Opera */
        }
        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Shimmer;
