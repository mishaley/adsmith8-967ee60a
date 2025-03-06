
import React from "react";
import { Button } from "@/components/ui/button";

interface WorldwideOptionProps {
  selectedCountry: string;
  highlightedIndex: number;
  onSelect: () => void;
  onMouseEnter: () => void;
}

const WorldwideOption: React.FC<WorldwideOptionProps> = ({
  selectedCountry,
  highlightedIndex,
  onSelect,
  onMouseEnter
}) => {
  return (
    <>
      <Button 
        key="worldwide" 
        type="button" 
        variant="ghost" 
        className={`w-full flex items-center justify-between px-4 py-2 text-left h-auto ${
          selectedCountry === "worldwide" ? "bg-gray-50" : ""
        } ${
          highlightedIndex === 0 ? "bg-gray-50" : ""
        }`} 
        onClick={onSelect}
        onMouseEnter={onMouseEnter}
      >
        <div className="flex items-center gap-2">
          <span className="inline-block w-6 text-center">🌐</span>
          <span className="font-medium">Worldwide</span>
        </div>
      </Button>
      
      {/* Divider */}
      <div className="border-t border-gray-100 my-1"></div>
    </>
  );
};

export default WorldwideOption;
