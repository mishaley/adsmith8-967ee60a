
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";

interface MessageColumnHeaderProps {
  columnId: string;
  columnType: string;
  onTypeChange: (columnId: string, newType: string) => void;
}

const MessageColumnHeader: React.FC<MessageColumnHeaderProps> = ({
  columnId,
  columnType,
  onTypeChange
}) => {
  const messageTypes = ["pain-point", "unique-offering", "value-prop", "user-provided"];

  return (
    <th className="border p-2 text-left">
      <Select 
        value={columnType} 
        onValueChange={(value) => onTypeChange(columnId, value)}
      >
        <SelectTrigger className="bg-white">
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
