
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
    <tr>
      <td className="p-2 align-top text-right">
        <div className="pt-2 font-semibold">{label}</div>
        {helperText && (
          <div className="text-xs text-gray-500 mt-1 max-w-xs">{helperText}</div>
        )}
      </td>
      <td className="p-2">
        <textarea
          ref={ref}
          value={value}
          onChange={onChange}
          onInput={handleInput}
          placeholder={placeholder}
          className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden min-h-[40px] max-h-96"
          rows={1}
          disabled={disabled}
        />
      </td>
    </tr>
  );
});

FormField.displayName = "FormField";

export default FormField;
