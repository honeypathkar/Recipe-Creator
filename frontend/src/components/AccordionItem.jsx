import React from "react";
import ExpandMore from "@mui/icons-material/ExpandMore"; // Icon for dropdown arrow

const AccordionItem = ({ id, title, icon, children, isOpen, onToggle }) => {
  // Use the icon component directly
  const IconComponent = icon;

  return (
    <div className="border-b border-slate-200 last:border-b-0">
      {/* Header Button */}
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="flex w-full items-center justify-between px-3 py-3 text-left text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${id}`}
      >
        <span className="flex items-center font-medium">
          {IconComponent && (
            // Render the passed icon component
            <IconComponent
              sx={{ fontSize: 20 }}
              className="mr-3 text-slate-500"
            />
          )}
          {title}
        </span>
        {/* Rotate arrow based on open state */}
        <ExpandMore
          sx={{ fontSize: 24 }}
          className={`transform text-slate-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Content Area with Transition */}
      {/* Using max-height for smooth transition */}
      <div
        id={`accordion-content-${id}`}
        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
          isOpen ? "max-h-96" : "max-h-0" // Adjust max-h if content is very long
        }`}
      >
        <div className="px-3 pb-4 pt-2 text-sm text-slate-600">
          {children} {/* Content passed to the accordion item */}
        </div>
      </div>
    </div>
  );
};

export default AccordionItem;
