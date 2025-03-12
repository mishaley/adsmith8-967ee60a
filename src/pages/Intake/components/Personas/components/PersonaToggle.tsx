
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface PersonaToggleProps {
  isSegmented: boolean;
  onToggleChange: (isSegmented: boolean) => void;
}

const PersonaToggle: React.FC<PersonaToggleProps> = ({
  isSegmented,
  onToggleChange,
}) => {
  return (
    <div className="flex items-center justify-center w-full mb-4">
      <div className="flex items-center space-x-6">
        <Label
          htmlFor="persona-toggle"
          className={`text-sm ${isSegmented ? 'text-gray-500' : 'text-gray-900 font-medium'}`}
        >
          General Population
        </Label>
        
        <Switch
          id="persona-toggle"
          checked={isSegmented}
          onCheckedChange={onToggleChange}
        />
        
        <Label
          htmlFor="persona-toggle"
          className={`text-sm ${isSegmented ? 'text-gray-900 font-medium' : 'text-gray-500'}`}
        >
          Segmented Groups
        </Label>
      </div>
    </div>
  );
};

export default PersonaToggle;
