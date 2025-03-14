
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { EnhancedDropdown, DropdownOption } from "@/components/ui/enhanced-dropdown";

interface AddColumnButtonProps {
  selectedTypes?: string[];
  onTypeChange?: (types: string[]) => void;
  onAddType?: (type: string) => void;
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
  
  // Create dropdown options
  const typeOptions: DropdownOption[] = availableTypes.map(type => ({
    id: type,
    label: type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }));
  
  const handleTypeSelection = (selectedIds: string[]) => {
    setIsAdding(false);
    
    if (selectedIds.length > 0) {
      if (onAddType) {
        onAddType(selectedIds[0]);
      } else if (onTypeChange) {
        const newTypes = [...selectedTypes, selectedIds[0]];
        onTypeChange(newTypes);
      }
    }
  };
  
  // If no more types are available, don't show the button
  if (availableTypes.length === 0) {
    return <th className="border p-2 w-10 bg-gray-50"></th>;
  }
  
  return (
    <th className="border p-2 w-10 bg-gray-50">
      {isAdding ? (
        <div className="min-w-[150px]">
          <EnhancedDropdown
            options={typeOptions}
            selectedItems={[]}
            onSelectionChange={handleTypeSelection}
            placeholder="Select type"
            searchPlaceholder="Search types..."
            multiSelect={false}
          />
        </div>
      ) : (
        <button 
          onClick={() => setIsAdding(true)}
          className="p-1 rounded hover:bg-gray-100 transition-colors flex items-center justify-center w-full"
          title="Add message type"
        >
          <Plus className="h-5 w-5 text-gray-500" />
        </button>
      )}
    </th>
  );
};

export default AddColumnButton;
