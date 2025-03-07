
import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddColumnButtonProps {
  selectedTypes?: string[]; // Made optional for backward compatibility
  onTypeChange?: (types: string[]) => void; // Made optional for backward compatibility
  onAddType?: (type: string) => void; // Added for alternative API
}

const AddColumnButton: React.FC<AddColumnButtonProps> = ({
  selectedTypes = [],
  onTypeChange,
  onAddType
}) => {
  const [isAdding, setIsAdding] = useState(false);
  
  const messageTypes = [
    "pain-point",
    "unique-offering", 
    "value-prop",
    "user-provided"
  ];
  
  // Filter out already selected types
  const availableTypes = messageTypes.filter(type => !selectedTypes.includes(type));
  
  const handleTypeSelection = (value: string) => {
    // Reset the adding state
    setIsAdding(false);
    
    if (value) {
      if (onAddType) {
        onAddType(value);
      } else if (onTypeChange) {
        const newTypes = [...selectedTypes, value];
        onTypeChange(newTypes);
      }
    }
  };
  
  // If no more types are available, don't show the button
  if (availableTypes.length === 0) {
    return <th className="border p-2 w-10"></th>;
  }
  
  return (
    <th className="border p-2 w-10">
      {isAdding ? (
        <Select onValueChange={handleTypeSelection}>
          <SelectTrigger className="min-w-[150px]" autoFocus>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {availableTypes.map(type => (
              <SelectItem key={type} value={type}>
                {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <button 
          onClick={() => setIsAdding(true)}
          className="p-1 rounded hover:bg-gray-100 transition-colors flex items-center justify-center w-full"
          title="Add message type"
        >
          <PlusCircle className="h-5 w-5 text-gray-500" />
        </button>
      )}
    </th>
  );
};

export default AddColumnButton;
