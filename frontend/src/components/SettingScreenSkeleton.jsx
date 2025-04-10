import React from "react";

const SettingScreenSkeleton = () => {
  return (
    // Outer container (no background, provides padding)
    <div className="min-h-screen flex justify-start items-start p-6 md:p-8 animate-pulse">
      {/* Two-column Flex container */}
      <div className="flex flex-col md:flex-row w-full gap-6 md:gap-8 items-start">
        {/* --- MODIFIED: Left Column Skeleton (Main Settings Card - Now Wider) --- */}
        <div className="w-full md:w-2/3">
          {/* Card structure for settings */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            {/* Profile Skeleton */}
            <div className="flex items-center pb-6 border-b border-slate-200">
              <div className="h-16 w-16 md:h-20 md:w-20 bg-slate-300 rounded-full mr-4 md:mr-6 flex-shrink-0"></div>
              <div className="flex-grow">
                <div className="h-6 bg-slate-300 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              </div>
            </div>
            {/* Stats Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 py-6 border-b border-slate-200">
              <div className="bg-slate-100 border border-slate-200 p-4 rounded-lg flex items-center">
                <div className="h-8 w-8 bg-slate-300 rounded mr-3 flex-shrink-0"></div>
                <div className="flex-grow">
                  <div className="h-4 bg-slate-300 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-slate-300 rounded w-1/4"></div>
                </div>
              </div>
              <div className="bg-slate-100 border border-slate-200 p-4 rounded-lg flex items-center">
                <div className="h-8 w-8 bg-slate-300 rounded mr-3 flex-shrink-0"></div>
                <div className="flex-grow">
                  <div className="h-4 bg-slate-300 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-slate-300 rounded w-1/4"></div>
                </div>
              </div>
            </div>
            {/* Danger Zone Skeleton */}
            <div className="pt-8">
              <div className="h-6 bg-slate-300 rounded w-1/4 mb-4"></div>
              <div className="bg-red-50 p-5 rounded-lg border border-red-200 space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  <div className="flex-grow mb-2 sm:mb-0 sm:mr-4 w-full">
                    <div className="h-5 bg-slate-300 rounded w-1/3 mb-1"></div>
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                  </div>
                  <div className="h-10 w-full sm:w-28 bg-slate-300 rounded flex-shrink-0"></div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-red-200 pt-5">
                  <div className="flex-grow mb-2 sm:mb-0 sm:mr-4 w-full">
                    <div className="h-5 bg-slate-300 rounded w-1/3 mb-1"></div>
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                  </div>
                  <div className="h-10 w-full sm:w-28 bg-slate-300 rounded flex-shrink-0"></div>
                </div>
              </div>
            </div>
          </div>{" "}
          {/* End settings card skeleton */}
        </div>{" "}
        {/* End Left column skeleton */}
        {/* --- MODIFIED: Right Column Skeleton (Accordion Menu - Now Narrower) --- */}
        <div className="w-full md:w-1/3 flex-shrink-0">
          {/* Card structure for accordion */}
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
            <div className="h-5 bg-slate-300 rounded w-1/2 mb-6"></div>{" "}
            {/* Heading placeholder */}
            <div className="space-y-0 border-t border-slate-200">
              {" "}
              {/* Use space-y-0, border-t */}
              {/* Placeholder for accordion items (header only visible) */}
              <div className="h-12 border-b border-slate-200 bg-slate-50 flex items-center px-3">
                <div className="h-5 w-3/4 bg-slate-300 rounded"></div>
              </div>
              <div className="h-12 border-b border-slate-200 bg-slate-50 flex items-center px-3">
                <div className="h-5 w-3/4 bg-slate-300 rounded"></div>
              </div>
              <div className="h-12 border-b border-slate-200 bg-slate-50 flex items-center px-3">
                <div className="h-5 w-3/4 bg-slate-300 rounded"></div>
              </div>
              <div className="h-12 border-b border-slate-200 bg-slate-50 flex items-center px-3">
                <div className="h-5 w-3/4 bg-slate-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>{" "}
        {/* End Right column skeleton */}
      </div>{" "}
      {/* End two-column flex container */}
    </div> // End main container
  );
};

export default SettingScreenSkeleton;
