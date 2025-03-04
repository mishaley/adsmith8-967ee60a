
import React from "react";

const PersonaPlaceholderCell: React.FC = () => {
  return (
    <div className="flex items-center">
      <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center mr-2">
        {/* Empty gray placeholder box */}
      </div>
      <div>
        <div className="text-sm text-gray-300">
          {/* Blank gender and age */}
          Gender, Age Range
        </div>
        <div className="text-sm text-gray-300">
          {/* Blank interests */}
          Interests
        </div>
      </div>
    </div>
  );
};

export default PersonaPlaceholderCell;
