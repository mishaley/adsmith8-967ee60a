
import React from "react";
import MultiSelect from "./MultiSelect";

interface MultiSelectFieldProps {
  options: { value: string; label: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  options,
  value,
  onChange,
  disabled = false,
  placeholder = ""
}) => {
  // Debug logging to track value and disabled state
  console.log(`MultiSelectField: ${placeholder}`, { disabled, value, optionsCount: options.length });

  return (
    <div className="w-full">
      <MultiSelect
        options={options}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
      />
    </div>
  );
};

export default MultiSelectField;
