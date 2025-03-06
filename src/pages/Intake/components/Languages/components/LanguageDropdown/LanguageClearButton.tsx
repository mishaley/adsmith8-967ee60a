
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface LanguageClearButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const LanguageClearButton: React.FC<LanguageClearButtonProps> = ({
  onClick,
  disabled
}) => {
  return (
    <Button 
      type="button" 
      variant="ghost" 
      className="w-full text-gray-500 flex items-center justify-center py-2"
      onClick={onClick}
      disabled={disabled}
    >
      <X className="h-4 w-4 mr-2" />
      Clear selection
    </Button>
  );
};

export default LanguageClearButton;
