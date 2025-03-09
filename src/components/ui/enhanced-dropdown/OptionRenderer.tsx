
import React from "react";
import { DropdownOption } from "./types";
import { Check } from "lucide-react";

interface OptionRendererProps {
  option: DropdownOption;
  isSelected: boolean;
  isHighlighted: boolean;
  multiSelect: boolean;
}

const OptionRenderer: React.FC<OptionRendererProps> = ({ 
  option, 
  isSelected,
  isHighlighted,
  multiSelect,
}) => {
  return (
    <div 
      className={`
        flex items-center justify-between p-2 px-3
        ${isHighlighted ? 'bg-accent' : ''}
        ${isSelected ? 'bg-accent/40' : ''}
      `}
    >
      <div className="flex items-center gap-2 truncate">
        {/* Render icon/emoji if present */}
        {typeof option.icon === 'string' ? (
          <span className="mr-1">{option.icon}</span>
        ) : option.icon ? (
          <span className="mr-1">{option.icon}</span>
        ) : null}
        
        {/* Main option content */}
        <div className="flex flex-col truncate">
          <span className="text-sm font-medium truncate">{option.label}</span>
          {option.secondary && (
            <span className="text-xs text-muted-foreground truncate">{option.secondary}</span>
          )}
        </div>
      </div>
      
      {/* Selection indicator */}
      {isSelected && (
        <div className="flex-shrink-0 ml-2">
          {multiSelect ? (
            <div className="h-4 w-4 rounded-sm border border-primary flex items-center justify-center bg-primary">
              <Check className="h-3 w-3 text-white" />
            </div>
          ) : (
            <Check className="h-4 w-4 text-primary" />
          )}
        </div>
      )}
    </div>
  );
};

export default OptionRenderer;
