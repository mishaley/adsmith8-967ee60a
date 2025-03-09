
import React from "react";
import { ClearButtonProps } from "./types";

const ClearButton: React.FC<ClearButtonProps> = ({ selectedItems, onClear, clearButtonText = "Clear selection" }) => {
  // Ensure selectedItems is an array and check if it has items
  const hasSelection = Array.isArray(selectedItems) 
    ? selectedItems.length > 0 
    : (selectedItems !== null && selectedItems !== undefined && selectedItems !== "");

  if (!hasSelection) {
    return null;
  }

  return (
    <div className="px-3 py-2 border-t border-gray-200">
      <button
        type="button"
        onClick={onClear}
        className="text-sm text-gray-600 hover:text-gray-900 hover:underline w-full text-left"
      >
        {clearButtonText}
      </button>
    </div>
  );
};

export default ClearButton;
