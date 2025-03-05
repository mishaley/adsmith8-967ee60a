
import React from "react";
import { Button } from "@/components/ui/button";

interface SelectionDisplayProps {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
}

const SelectionDisplay: React.FC<SelectionDisplayProps> = ({
  selectedCountry,
  setSelectedCountry
}) => {
  return (
    <div className="w-full bg-[#f5f9ff] rounded-lg p-4 border border-[#d0e1f9]">
      <div className="font-bold text-lg mb-4">Selections</div>
      {selectedCountry ? (
        <div className="p-3 bg-[#f5f9ff] rounded border border-[#d0e1f9]">
          <p className="font-medium">Selected Country:</p>
          <p className="text-[#154851] font-bold">{selectedCountry}</p>
        </div>
      ) : (
        <div className="p-3 bg-gray-50 rounded border border-gray-200 text-gray-500">
          No country selected. Click on the map to select a country.
        </div>
      )}
      {selectedCountry && (
        <div className="mt-3 flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSelectedCountry('')}
          >
            Clear Selection
          </Button>
        </div>
      )}
    </div>
  );
};

export default SelectionDisplay;
