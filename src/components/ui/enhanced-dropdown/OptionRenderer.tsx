
import React from "react";
import { Check } from "lucide-react";
import { DropdownOption } from "./types";

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
    <div className="flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-2">
        {multiSelect && (
          <div className={`flex items-center justify-center w-5 h-5 mr-1 border rounded ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
            {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
          </div>
        )}
        {typeof option.icon === 'string' ? (
          <span className="inline-block w-6 text-center">{option.icon}</span>
        ) : option.icon ? (
          option.icon
        ) : null}
        <span className="truncate">{option.label}</span>
      </div>
      {option.secondary && (
        <span className="text-gray-500 truncate">{option.secondary}</span>
      )}
    </div>
  );
};

export default OptionRenderer;
