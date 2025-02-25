
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColumnDef } from '@/types/table';

interface TableCellEditorProps {
  value: string;
  column: ColumnDef;
  onUpdate: (value: string) => void;
  className?: string;
}

export const TableCellEditor: React.FC<TableCellEditorProps> = ({
  value,
  column,
  onUpdate,
  className = ''
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  if (column.inputMode === 'select' && column.options) {
    return (
      <div className="w-full" onClick={(e) => e.stopPropagation()}>
        <Select
          defaultValue={value}
          onValueChange={onUpdate}
        >
          <SelectTrigger className="w-full bg-white border-none shadow-none focus:ring-0">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            {column.options.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <input
      type="text"
      defaultValue={value}
      onBlur={(e) => onUpdate(e.target.value)}
      onKeyDown={handleKeyDown}
      className={`w-full bg-transparent outline-none p-0 ${className}`}
      autoFocus
    />
  );
};
