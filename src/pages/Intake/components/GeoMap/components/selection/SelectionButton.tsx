
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface SelectionButtonProps {
  onClick: () => void;
  selectedFlag: string | null;
  displayName: string;
}

const SelectionButton: React.FC<SelectionButtonProps> = ({
  onClick,
  selectedFlag,
  displayName
}) => {
  return (
    <Button
      variant="outline"
      className="w-full justify-between font-normal bg-white"
      onClick={onClick}
    >
      <span className="flex items-center gap-2 text-left truncate">
        {selectedFlag && (
          <span className="inline-block w-6 text-center">{selectedFlag}</span>
        )}
        <span>{displayName}</span>
      </span>
      <ChevronDown className="h-4 w-4 shrink-0" />
    </Button>
  );
};

export default SelectionButton;
