
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ClearButtonProps } from "./types";

const ClearButton: React.FC<ClearButtonProps> = ({
  selectedItems,
  onClear,
  clearButtonText,
}) => {
  return (
    <div className="sticky bottom-0 w-full border-t border-gray-200 bg-white">
      <Button 
        type="button" 
        variant="ghost" 
        className="w-full text-gray-500 flex items-center justify-center py-2"
        onClick={onClear}
        disabled={selectedItems.length === 0}
      >
        <X className="h-4 w-4 mr-2" />
        {clearButtonText}
      </Button>
    </div>
  );
};

export default ClearButton;
