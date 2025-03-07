
import React from "react";
import { Button } from "@/components/ui/button";

interface OrganizationButtonProps {
  onClick: () => void;
  isDisabled: boolean;
  isCreating: boolean;
}

const OrganizationButton: React.FC<OrganizationButtonProps> = ({
  onClick,
  isDisabled,
  isCreating
}) => {
  return (
    <div className="flex justify-center mt-6 mb-3">
      <Button 
        onClick={onClick} 
        className="w-20"
        disabled={isDisabled}
        style={{ backgroundColor: "#0c343d" }}
      >
        {isCreating ? "Saving..." : "NEXT"}
      </Button>
    </div>
  );
};

export default OrganizationButton;
