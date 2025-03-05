
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";

interface SingleSelectFieldProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const SingleSelectField: React.FC<SingleSelectFieldProps> = ({
  options,
  value,
  onChange,
  disabled = false,
  placeholder = "Select an option"
}) => {
  const handleSelectChange = (selectedValue: string) => {
    // Clear selection if "clear-selection" is chosen
    if (selectedValue === "clear-selection") {
      onChange("");
    } else {
      onChange(selectedValue);
    }
  };

  return (
    <Select value={value || ""} onValueChange={handleSelectChange} disabled={disabled}>
      <SelectTrigger className="w-full bg-white">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-white min-w-[var(--radix-select-trigger-width)] w-fit">
        {options.map((option) => (
          <SelectItem 
            key={option.value}
            value={option.value}
          >
            {option.label}
          </SelectItem>
        ))}
        <SelectSeparator className="my-1" />
        <SelectItem value="clear-selection" className="text-gray-500">
          Clear
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SingleSelectField;
