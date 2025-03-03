
import React from "react";

interface FormFieldProps {
  label: string;
  helperText?: string;
  helperTextClassName?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormField = ({ 
  label, 
  helperText, 
  helperTextClassName = "text-sm text-gray-500 mt-1", 
  value, 
  onChange 
}: FormFieldProps) => {
  return (
    <tr className="border-transparent">
      <td className="py-4 pr-4 text-lg">
        <div>{label}</div>
        {helperText && <div className={helperTextClassName}>{helperText}</div>}
      </td>
      <td className="py-4">
        <div className="w-96">
          <input
            type="text"
            value={value}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </td>
    </tr>
  );
};

export default FormField;
