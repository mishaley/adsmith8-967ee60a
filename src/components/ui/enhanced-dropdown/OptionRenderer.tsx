
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
  multiSelect
}) => {
  return (
    <div 
      className={`
        flex items-center justify-between px-4 py-2 
        ${isSelected ? 'bg-gray-100' : ''}
        ${isHighlighted ? 'bg-gray-50' : ''}
      `}
    >
      <div className="flex items-center gap-2">
        {option.icon && (
          <span className="flex-shrink-0">
            {typeof option.icon === 'string' ? option.icon : option.icon}
          </span>
        )}
        
        <div className="flex flex-col">
          <span className="text-sm font-medium">{option.label}</span>
          {option.secondary && (
            <span className="text-xs text-gray-500">{option.secondary}</span>
          )}
        </div>
      </div>
      
      {isSelected && (
        <span className="flex-shrink-0 text-blue-500">
          {multiSelect ? (
            <div className="h-4 w-4 rounded-sm border border-blue-500 bg-blue-500 flex items-center justify-center">
              <Check className="h-3 w-3 text-white" />
            </div>
          ) : (
            <Check className="h-4 w-4" />
          )}
        </span>
      )}
      
      {/* Empty checkbox for non-selected items in multi-select mode */}
      {!isSelected && multiSelect && (
        <div className="h-4 w-4 rounded-sm border border-gray-300"></div>
      )}
    </div>
  );
};

export default OptionRenderer;
