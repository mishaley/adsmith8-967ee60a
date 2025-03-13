
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import { logDebug } from "@/utils/logging";

interface SingleSelectFieldProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  showNewOption?: boolean;
  newOptionLabel?: string;
}

const SingleSelectField: React.FC<SingleSelectFieldProps> = ({
  options,
  value,
  onChange,
  disabled = false,
  placeholder = "",
  showNewOption = false,
  newOptionLabel = "+ NEW"
}) => {
  // Log for debugging
  React.useEffect(() => {
    logDebug(`SingleSelectField rendered: disabled=${disabled}, options=${options.length}, value=${value || "empty"}`, 'ui');
  }, [disabled, options.length, value]);

  const handleSelectChange = (selectedValue: string) => {
    logDebug(`Select change: ${selectedValue}`, 'ui');
    if (selectedValue === "clear-selection") {
      onChange("");
    } else {
      onChange(selectedValue);
    }
  };

  return (
    <Select 
      value={value} 
      onValueChange={handleSelectChange} 
      // disabled={disabled}
    >
      <SelectTrigger className="w-full bg-white border border-input hover:bg-accent hover:text-accent-foreground">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent 
        className="bg-white border rounded-md shadow-md min-w-[var(--radix-select-trigger-width)] w-fit z-[100]"
        position="popper"
        align="center"
        sideOffset={4}
      >
        {showNewOption && (
          <>
            <SelectItem value="new-offering" className="font-semibold text-blue-600 cursor-pointer">
              {newOptionLabel}
            </SelectItem>
            <SelectSeparator className="my-1" />
          </>
        )}
        
        {options.map((option) => (
          <SelectItem 
            key={option.value}
            value={option.value}
            className="cursor-pointer"
          >
            {option.label}
          </SelectItem>
        ))}
        
        {value && (
          <>
            <SelectSeparator className="my-1" />
            <SelectItem value="clear-selection" className="text-gray-500 cursor-pointer">
              Clear
            </SelectItem>
          </>
        )}
      </SelectContent>
    </Select>
  );
};

export default SingleSelectField;
