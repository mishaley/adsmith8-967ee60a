
import React from "react";
import { Button } from "@/components/ui/button";

interface Country {
  country_id: string;
  country_name: string;
  country_flag: string;
  country_iso2: string;
  country_iso3: string;
}

interface CountryListProps {
  filteredCountries: Country[];
  selectedCountry: string;
  highlightedIndex: number;
  onSelect: (countryId: string, flag: string) => void;
  setHighlightedIndex: (index: number) => void;
  isExcludeDropdown: boolean;
}

const CountryList: React.FC<CountryListProps> = ({
  filteredCountries,
  selectedCountry,
  highlightedIndex,
  onSelect,
  setHighlightedIndex,
  isExcludeDropdown
}) => {
  if (filteredCountries.length === 0) {
    return <div className="p-4 text-center text-gray-500">No countries found</div>;
  }

  return (
    <>
      {filteredCountries.map((country, index) => {
        // Calculate the correct highlight index based on dropdown type
        const highlightIndex = isExcludeDropdown ? index : index + 1;
        
        return (
          <Button 
            key={country.country_id} 
            type="button" 
            variant="ghost" 
            className={`w-full flex items-center justify-between px-4 py-2 text-left h-auto ${
              selectedCountry === country.country_id ? "bg-gray-50" : ""
            } ${
              highlightedIndex === highlightIndex ? "bg-gray-50" : ""
            }`} 
            onClick={() => onSelect(country.country_id, country.country_flag)}
            onMouseEnter={() => setHighlightedIndex(highlightIndex)}
          >
            <div className="flex items-center gap-2">
              <span className="inline-block w-6 text-center">{country.country_flag}</span>
              <span className="truncate">{country.country_name}</span>
            </div>
          </Button>
        );
      })}
    </>
  );
};

export default CountryList;
