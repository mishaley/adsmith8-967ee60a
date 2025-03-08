
import React, { forwardRef } from "react";
import { TriggerButtonProps } from "./types";
import { ChevronDown } from "lucide-react";

const TriggerButton = forwardRef<HTMLButtonElement, TriggerButtonProps>(
  ({ placeholder, buttonIcon, selectedOptionLabels, multiSelect, onToggle, disabled, buttonClassName }, ref) => {
    // Determine what to display in the button
    const hasSelection = selectedOptionLabels.length > 0;
    
    // Format the display text based on selection count
    const getDisplayText = () => {
      if (!hasSelection) return placeholder;
      
      if (multiSelect) {
        if (selectedOptionLabels.length === 1) {
          return selectedOptionLabels[0].label;
        } else {
          return `${selectedOptionLabels.length} selected`;
        }
      } else {
        return selectedOptionLabels[0].label;
      }
    };
    
    // Get the icon to display (either from the first selected option or the provided buttonIcon)
    const displayIcon = hasSelection && selectedOptionLabels[0].icon 
      ? selectedOptionLabels[0].icon 
      : buttonIcon;
      
    // For multi-select with multiple items, show count instead of an icon
    const showMultiCount = multiSelect && selectedOptionLabels.length > 1;
    
    return (
      <button
        ref={ref}
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className={`flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${buttonClassName}`}
      >
        <div className="flex items-center">
          {!showMultiCount && displayIcon && (
            <span className="mr-2 flex items-center">
              {typeof displayIcon === "string" ? displayIcon : displayIcon}
            </span>
          )}
          <span className="truncate">{getDisplayText()}</span>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>
    );
  }
);

TriggerButton.displayName = "TriggerButton";

export default TriggerButton;
