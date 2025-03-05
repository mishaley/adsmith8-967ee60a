
import React from "react";
import { Button } from "@/components/ui/button";

interface CountryStatusDisplayProps {
  selectedCountry: string;
  countryName: string | null;
  onClearSelection: () => void;
}

const CountryStatusDisplay: React.FC<CountryStatusDisplayProps> = ({
  selectedCountry,
  countryName,
  onClearSelection
}) => {
  return (
    <>
      {selectedCountry ? (
        <div className="p-3 bg-[#f5f9ff] rounded border border-[#d0e1f9]">
          <p className="font-medium">Selected Country from Map:</p>
          <p className="text-[#0c343d] font-bold">{countryName || selectedCountry}</p>
        </div>
      ) : (
        <div className="p-3 bg-gray-50 rounded border border-gray-200 text-gray-500">
          No country selected on map. Click on the map to select a country.
        </div>
      )}
      
      {selectedCountry && (
        <div className="mt-3 flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearSelection}
          >
            Clear Selection
          </Button>
        </div>
      )}
    </>
  );
};

export default CountryStatusDisplay;
