
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface AddColumnButtonProps {
  onAddColumn: () => void;
}

const AddColumnButton: React.FC<AddColumnButtonProps> = ({ onAddColumn }) => {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="p-1 h-8 w-8"
      onClick={onAddColumn}
      title="Add another message column"
    >
      <PlusCircle className="h-6 w-6 text-gray-500 hover:text-[#0c343d]" />
    </Button>
  );
};

export default AddColumnButton;
