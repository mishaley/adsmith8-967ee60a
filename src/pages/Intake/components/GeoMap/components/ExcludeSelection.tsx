
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, X } from "lucide-react";
import CountryDropdown from "./CountryDropdown";
import { useCountries } from "../hooks/useCountries";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ExcludeSelectionProps {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  countryName: string | null;
  setExcludedCountryId?: ((id: string) => void) | null;
}

const ExcludeSelection: React.FC<ExcludeSelectionProps> = ({
  selectedCountry,
  setSelectedCountry,
  countryName,
  setExcludedCountryId
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCountryFlag, setSelectedCountryFlag] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { countries } = useCountries();

  useEffect(() => {
    if (selectedCountry && countries.length > 0) {
      const country = countries.find(c => c.country_id === selectedCountry);
      if (country) {
        setSelectedCountryFlag(country.country_flag);
        
        // Highlight the excluded country on the map if possible
        if (setExcludedCountryId) {
          // We might need to convert UUID to ISO code first
          const iso = country.country_iso2 || country.country_iso3;
          if (iso) {
            console.log(`Highlighting excluded country on map: ${iso}`);
            setExcludedCountryId(iso);
          }
        }
      }
    } else {
      setSelectedCountryFlag(null);
    }
  }, [selectedCountry, countries, setExcludedCountryId]);

  const handleCountrySelect = (country: string, flag?: string) => {
    setSelectedCountry(country);
    if (flag) setSelectedCountryFlag(flag);
    setIsDropdownOpen(false);
  };

  const handleClearSelection = () => {
    setSelectedCountry("");
    setSelectedCountryFlag(null);
    
    // Clear excluded country on the map
    if (setExcludedCountryId) {
      setExcludedCountryId("");
    }
    
    setIsDropdownOpen(false); // Close the dropdown after clearing
  };

  return (
    <div>
      <div className="font-bold text-lg mb-4">Exclude</div>
      
      <Popover open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between font-normal bg-white"
          >
            <span className="flex items-center gap-2 text-left truncate">
              {selectedCountryFlag && (
                <span className="inline-block w-6 text-center">{selectedCountryFlag}</span>
              )}
              <span>{countryName || ""}</span>
            </span>
            <ChevronDown className="h-4 w-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent 
          align="center" 
          side="top" 
          className="w-[var(--radix-popover-trigger-width)] p-0 bg-white rounded-md shadow-lg border-gray-100"
          style={{ border: '1px solid #f1f1f1' }}
        >
          <div className="max-h-60 overflow-auto">
            <CountryDropdown 
              selectedCountry={selectedCountry} 
              setSelectedCountry={handleCountrySelect}
              setSelectedCountryId={null}
            />
          </div>
          <div className="sticky bottom-0 w-full border-t border-gray-100 bg-white">
            <Button 
              type="button" 
              variant="ghost" 
              className="w-full text-gray-500 flex items-center justify-center py-2"
              onClick={handleClearSelection}
              disabled={!selectedCountry}
            >
              <X className="h-4 w-4 mr-2" />
              Clear selection
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ExcludeSelection;
