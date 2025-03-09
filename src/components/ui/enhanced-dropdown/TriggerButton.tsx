
import React, { forwardRef } from "react";
import { TriggerButtonProps } from "./types";
import { ChevronDown, ChevronUp, X } from "lucide-react";

const TriggerButton = forwardRef<HTMLButtonElement, TriggerButtonProps>(
  ({ placeholder, buttonIcon, selectedOptionLabels, multiSelect, onToggle, disabled, buttonClassName }, ref) => {
    const hasSelection = selectedOptionLabels.length > 0;
    
    // Render the selected items differently based on single or multi-select
    const renderSelectedContent = () => {
      if (!hasSelection) {
        // Only show placeholder if it's not empty
        return placeholder ? <span className="text-muted-foreground">{placeholder}</span> : <span></span>;
      }
      
      if (multiSelect) {
        // For multi-select, show the number of items selected and the first item
        if (selectedOptionLabels.length > 1) {
          const firstOption = selectedOptionLabels[0];
          return (
            <div className="flex items-center gap-1 truncate">
              <span className="flex items-center gap-1 truncate">
                {typeof firstOption.icon === 'string' ? (
                  <span className="mr-1">{firstOption.icon}</span>
                ) : firstOption.icon ? (
                  <span className="mr-1">{firstOption.icon}</span>
                ) : null}
                {firstOption.label}
              </span>
              <span className="text-muted-foreground">+{selectedOptionLabels.length - 1} more</span>
            </div>
          );
        } else {
          // Only one item selected in multi-select
          const option = selectedOptionLabels[0];
          return (
            <span className="flex items-center gap-1 truncate">
              {typeof option.icon === 'string' ? (
                <span className="mr-1">{option.icon}</span>
              ) : option.icon ? (
                <span className="mr-1">{option.icon}</span>
              ) : null}
              {option.label}
            </span>
          );
        }
      } else {
        // For single-select, show just the selected item
        const option = selectedOptionLabels[0];
        return (
          <span className="flex items-center gap-1 truncate">
            {typeof option.icon === 'string' ? (
              <span className="mr-1">{option.icon}</span>
            ) : option.icon ? (
              <span className="mr-1">{option.icon}</span>
            ) : null}
            {option.label}
          </span>
        );
      }
    };
    
    return (
      <button
        ref={ref}
        type="button"
        onClick={() => onToggle()}
        disabled={disabled}
        className={`
          w-full px-3 py-2 text-left flex items-center justify-between
          border border-input rounded-md bg-background
          hover:bg-accent hover:text-accent-foreground
          focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-50
          ${buttonClassName}
        `}
        aria-haspopup="listbox"
        aria-expanded="true"
      >
        <div className="truncate flex-1 flex items-center">
          {buttonIcon && <span className="mr-2">{buttonIcon}</span>}
          {renderSelectedContent()}
        </div>
        
        <div className="flex items-center">
          {hasSelection && <X className="h-4 w-4 mr-1 opacity-60" />}
          {hasSelection ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>
    );
  }
);

TriggerButton.displayName = "TriggerButton";

export default TriggerButton;
