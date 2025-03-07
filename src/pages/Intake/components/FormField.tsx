
import React, { forwardRef, useEffect } from "react";

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
}

const FormField = forwardRef<HTMLTextAreaElement, FormFieldProps>(({
  label,
  value,
  onChange,
  placeholder = "",
  helperText = "",
  disabled = false
}, ref) => {
  
  // Add auto-resize functionality
  const handleResize = (textarea: HTMLTextAreaElement | null) => {
    if (!textarea) return;
    
    // Reset height to get the correct scrollHeight
    textarea.style.height = 'auto';
    
    // Set the height to match content
    const newHeight = Math.max(40, Math.min(textarea.scrollHeight, 300));
    textarea.style.height = `${newHeight}px`;
  };
  
  // Auto-resize when value changes
  useEffect(() => {
    if (ref && 'current' in ref && ref.current) {
      handleResize(ref.current);
    }
  }, [value, ref]);
  
  // Handle input event for real-time resizing
  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    handleResize(e.currentTarget);
  };

  return (
    <tr className="border-transparent">
      <td className="py-4 pr-4 text-lg whitespace-nowrap min-w-[180px]">
        <div>{label}</div>
        {helperText && (
          <div className="text-sm text-gray-500 mt-1">{helperText}</div>
        )}
      </td>
      <td className="py-4">
        <textarea
          ref={ref}
          value={value}
          onChange={onChange}
          onInput={handleInput}
          className={`w-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-indigo-500 resize-none ${disabled ? 'bg-gray-100' : ''}`}
          placeholder={placeholder}
          rows={1}
          disabled={disabled}
        />
      </td>
    </tr>
  );
});

FormField.displayName = "FormField";

export default FormField;
