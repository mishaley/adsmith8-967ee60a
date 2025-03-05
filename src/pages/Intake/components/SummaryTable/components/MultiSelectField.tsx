
import React from "react";
import MultiSelect from "./MultiSelect";

interface MultiSelectFieldProps {
  options: { value: string; label: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}

const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  options,
  value,
  onChange,
  disabled = false
}) => {
  return (
    <MultiSelect
      options={options}
      value={value}
      onChange={onChange}
      placeholder=""
      disabled={disabled}
    />
  );
};

export default MultiSelectField;
