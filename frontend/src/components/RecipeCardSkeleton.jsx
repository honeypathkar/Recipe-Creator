import React from "react";

const RecipeCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse flex flex-col h-full">
      {/* --- Optional Image Placeholder --- */}
      {/* <div className="w-full h-40 bg-gray-300"></div> */}

      {/* --- Card Body --- */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Header: Title and Action Icons */}
        <div className="flex justify-between items-start mb-2">
          {/* Title Placeholder */}
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          {/* Icon Placeholders */}
          <div className="flex space-x-2 flex-shrink-0">
            <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
            <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        {/* Cuisine Placeholder */}
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>

        {/* Ingredients Preview Placeholder */}
        <div className="mb-4 flex-grow">
          {/* Heading Placeholder */}
          <div className="h-5 bg-gray-300 rounded w-1/3 mb-2"></div>
          {/* List Item Placeholders */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </div>

        {/* Footer Placeholder */}
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
          {/* See More Button Placeholder */}
          <div className="h-8 bg-gray-300 rounded w-24"></div>
          {/* Delete Button Placeholder (Optional: you might hide this if not always present) */}
          {/* For simplicity, often shown in skeleton */}
          <div className="h-8 bg-gray-300 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCardSkeleton;
