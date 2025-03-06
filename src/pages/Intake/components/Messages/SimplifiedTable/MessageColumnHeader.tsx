
import React, { useEffect, useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";

interface MessageColumnHeaderProps {
  columnId: string;
  columnType: string;
  isNewColumn?: boolean;
  onTypeChange: (columnId: string, newType: string) => void;
}

const MessageColumnHeader: React.FC<MessageColumnHeaderProps> = ({
  columnId,
  columnType,
  isNewColumn = false,
  onTypeChange
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
};

export default MessageColumnHeader;
