
import React, { useEffect, useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessageColumnHeaderProps {
  columnId: string;
  columnType: string;
  isNewColumn?: boolean;
  onTypeChange: (columnId: string, newType: string) => void;
  onGenerateClick?: (columnId: string, columnType: string) => void;
}

const MessageColumnHeader: React.FC<MessageColumnHeaderProps> = ({
  columnId,
  columnType,
  isNewColumn = false,
  onTypeChange,
  onGenerateClick
}) => {
  const messageTypes = ["pain-point", "unique-offering", "value-prop", "user-provided"];
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Auto-open dropdown when new column is added
  useEffect(() => {
    if (isNewColumn && triggerRef.current) {
      setTimeout(() => {
        triggerRef.current?.click();
      }, 100);
    }
  }, [isNewColumn]);

  // If the column has no type selected yet, show type selector
  if (!columnType) {
    return (
      <th className="border p-2 text-left">
        <Select 
          value={columnType} 
          onValueChange={(value) => onTypeChange(columnId, value)}
          defaultOpen={isNewColumn}
        >
          <SelectTrigger className="bg-white" ref={triggerRef}>
            <SelectValue placeholder="Select message type" />
          </SelectTrigger>
          <SelectContent>
            {messageTypes.map(type => (
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
          {columnType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </span>
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-2 text-xs"
          onClick={() => onGenerateClick && onGenerateClick(columnId, columnType)}
        >
          Generate
        </Button>
      </div>
    </th>
  );
};

export default MessageColumnHeader;
