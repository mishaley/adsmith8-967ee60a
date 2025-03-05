
import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";

interface MultiSelectProps {
  options: { value: string; label: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ 
  options, 
  value, 
  onChange, 
  placeholder = "", 
  disabled = false 
}) => {
  const [open, setOpen] = useState(false);
  
  // Close dropdown when component becomes disabled
  useEffect(() => {
    if (disabled) {
      setOpen(false);
    }
  }, [disabled]);
  
  const handleValueChange = (itemValue: string) => {
    if (disabled) return;
    
    const newValue = [...value];
    const index = newValue.indexOf(itemValue);
    
    if (index === -1) {
      newValue.push(itemValue);
    } else {
      newValue.splice(index, 1);
    }
    
    onChange(newValue);
  };
  
  const displayValue = () => {
    if (value.length === 0 || disabled) return placeholder;
    if (value.length === 1) {
      const selectedOption = options.find(option => option.value === value[0]);
      return selectedOption ? selectedOption.label : "";
    }
    return `${value.length} selected`;
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={`flex h-9 w-full items-center justify-between px-3 text-sm border border-gray-300 rounded-md ${
          disabled ? 'bg-gray-100 opacity-50 cursor-not-allowed' : 'bg-white'
        }`}
      >
        <span className="text-left w-full truncate">{displayValue()}</span>
        <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0" />
      </button>
      
      {open && !disabled && (
        <div className="absolute z-50 mt-1 w-full overflow-visible bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="p-1">
            {options.length === 0 ? (
              <div className="py-2 px-3 text-gray-400 italic text-left">No options available</div>
            ) : (
              options.map(option => (
                <div 
                  key={option.value} 
                  className="relative flex items-center px-2 py-2 hover:bg-gray-100 cursor-pointer text-left"
                  onClick={() => handleValueChange(option.value)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleValueChange(option.value);
                    }
                  }}
                >
                  <Checkbox 
                    id={`option-${option.value}`}
                    checked={value.includes(option.value)} 
                    className="mr-2"
                    onCheckedChange={() => {}}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <label 
                    htmlFor={`option-${option.value}`}
                    className="flex-grow cursor-pointer text-left"
                    onClick={(e) => e.preventDefault()}
                  >
                    {option.label}
                  </label>
                </div>
              ))
            )}
            
            {value.length > 0 && (
              <>
                <div className="mx-1 my-1 h-px bg-gray-200" />
                <div 
                  className="px-2 py-2 text-gray-500 hover:bg-gray-100 cursor-pointer text-left"
                  onClick={() => onChange([])}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onChange([]);
                    }
                  }}
                >
                  Clear
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {open && !disabled && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)} 
        />
      )}
    </div>
  );
};

export default MultiSelect;
