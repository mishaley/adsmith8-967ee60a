
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
  return (
    <MultiSelect
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
};

export default MultiSelectField;
