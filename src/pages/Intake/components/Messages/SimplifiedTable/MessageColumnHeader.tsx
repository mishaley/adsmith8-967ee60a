
import React, { useEffect, useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessageColumnHeaderProps {
  columnId: string;
  columnType: string;
  column?: { id: string; type: string; content?: Record<string, any> }; // Added for backward compatibility
  isNewColumn?: boolean;
  onTypeChange?: (columnId: string, newType: string) => void;
  onGenerateClick?: (columnId: string, columnType: string) => void;
  onRemoveColumn?: () => void; // Added for backward compatibility
}

const MessageColumnHeader: React.FC<MessageColumnHeaderProps> = ({
  columnId,
  columnType,
  column, // For backward compatibility
  isNewColumn = false,
  onTypeChange,
  onGenerateClick,
  onRemoveColumn
}) => {
  // Use either direct props or extract from column object for backward compatibility
  const id = column?.id || columnId;
  const type = column?.type || columnType;
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Auto-open dropdown when new column is added
  useEffect(() => {
    if (isNewColumn && triggerRef.current) {
      setTimeout(() => {
        triggerRef.current?.click();
      }, 100);
    }
  }, [isNewColumn]);

  const handleTypeChange = (value: string) => {
    if (onTypeChange) {
      onTypeChange(id, value);
    } else if (onRemoveColumn && value === "remove") {
      onRemoveColumn();
    }
  };

  // If the column has no type selected yet, show type selector
  if (!type) {
    return (
      <th className="border p-2 text-left">
        <Select 
          value={type} 
          onValueChange={handleTypeChange}
          defaultOpen={isNewColumn}
        >
          <SelectTrigger className="bg-white" ref={triggerRef}>
            <SelectValue placeholder="Select message type" />
          </SelectTrigger>
          <SelectContent>
            {["pain-point", "unique-offering", "value-prop", "user-provided"].map(type => (
              <SelectItem key={type} value={type}>
                {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </SelectItem>
            ))}
            {/* Add remove option with red text */}
            <SelectItem key="remove" value="remove" className="text-red-500">
              <div className="flex items-center">
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </th>
    );
  }

  // If column has type selected, show Generate button
  return (
    <th className="border p-2 text-left">
      <div className="flex items-center justify-between">
        <span className="font-medium text-gray-700">
          {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </span>
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-2 text-xs"
          onClick={() => onGenerateClick && onGenerateClick(id, type)}
        >
          Generate
        </Button>
      </div>
    </th>
  );
};

export default MessageColumnHeader;
