
import React from "react";
import { Input } from "@/components/ui/input";

interface FormFieldProps {
  label: string;
  helperText?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormField = ({ label, helperText, value, onChange }: FormFieldProps) => {
  return (
    <tr className="border-b">
      <td className="py-4 pr-4 text-lg whitespace-nowrap w-auto">
        <div>{label}</div>
        {helperText && <div className="text-sm text-gray-500 mt-1">{helperText}</div>}
      </td>
      <td className="py-4 w-full">
        <Input
          type="text"
          value={value}
          onChange={onChange}
          className="w-64"
        />
      </td>
    </tr>
  );
};

export default FormField;
