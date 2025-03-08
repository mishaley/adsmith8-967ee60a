
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { TriggerButtonProps } from "./types";

const TriggerButton = React.forwardRef<HTMLButtonElement, TriggerButtonProps>(({
  placeholder,
  buttonIcon,
  selectedOptionLabels,
  multiSelect,
  onToggle,
  disabled,
  buttonClassName,
}, ref) => {
  return (
    <Button
      ref={ref}
      variant="outline"
      className={`w-full justify-between font-normal ${buttonClassName} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onToggle}
      disabled={disabled}
      type="button"
    >
      <span className="flex items-center gap-2 text-left truncate">
        {selectedOptionLabels.length > 0 ? (
          <>
            {selectedOptionLabels[0].icon && typeof selectedOptionLabels[0].icon === 'string' && (
              <span className="inline-block w-6 text-center">
                {selectedOptionLabels[0].icon}
              </span>
            )}
            {multiSelect && selectedOptionLabels.length > 1 ? (
              <span>{selectedOptionLabels.length} selected</span>
            ) : (
              <span>{selectedOptionLabels[0].label}</span>
            )}
          </>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
      </span>
      {buttonIcon || <ChevronDown className="h-4 w-4 shrink-0" />}
    </Button>
  );
});

TriggerButton.displayName = "TriggerButton";

export default TriggerButton;
