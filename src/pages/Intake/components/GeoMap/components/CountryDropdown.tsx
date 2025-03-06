
import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCountries } from "../hooks/useCountries";
import { Search, X } from "lucide-react";

interface CountryDropdownProps {
  selectedCountry: string;
  setSelectedCountry: (country: string, flag?: string) => void;
  setSelectedCountryId?: ((id: string) => void) | null;
}

const CountryDropdown: React.FC<CountryDropdownProps> = ({
  selectedCountry,
  setSelectedCountry,
  setSelectedCountryId
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { countries, isLoading } = useCountries();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Focus the search input when the dropdown is opened
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Filter countries based on search term
  const filteredCountries = countries.filter(country => 
    country.country_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle country selection
  const handleCountrySelect = (countryId: string, flag: string) => {
    console.log(`CountryDropdown: Selected country ${countryId}`);
    setSelectedCountry(countryId, flag);
    
    // Also highlight on map if the function is available
    if (setSelectedCountryId) {
      console.log(`CountryDropdown: Triggering map highlight for ${countryId}`);
      
      // Get the country object
      const selectedCountry = countries.find(c => c.country_id === countryId);
      
      if (selectedCountry) {
        // Use ISO3 code for map highlighting as it matches the GeoJSON features better
        if (selectedCountry.country_iso3) {
          console.log(`Using ISO3 code for highlighting: ${selectedCountry.country_iso3}`);
          setSelectedCountryId(selectedCountry.country_iso3);
        } else if (selectedCountry.country_iso2) {
          console.log(`Using ISO2 code for highlighting: ${selectedCountry.country_iso2}`);
          setSelectedCountryId(selectedCountry.country_iso2);
        } else {
          console.log(`No ISO code found, using country_id: ${countryId}`);
          setSelectedCountryId(countryId);
        }
      } else {
        setSelectedCountryId(countryId);
      }
    }
  };

  // Clear search term
  const clearSearch = () => {
    setSearchTerm("");
    setHighlightedIndex(-1);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (filteredCountries.length === 0) return;
    
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex(prevIndex => {
          const nextIndex = prevIndex < filteredCountries.length - 1 ? prevIndex + 1 : 0;
          ensureHighlightedItemVisible(nextIndex);
          return nextIndex;
        });
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(prevIndex => {
          const nextIndex = prevIndex > 0 ? prevIndex - 1 : filteredCountries.length - 1;
          ensureHighlightedItemVisible(nextIndex);
          return nextIndex;
        });
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredCountries.length) {
          const country = filteredCountries[highlightedIndex];
          handleCountrySelect(country.country_id, country.country_flag);
        }
        break;
      case "Escape":
        e.preventDefault();
        clearSearch();
        break;
    }
  };

  // Ensure the highlighted item is visible in the scrollable area
  const ensureHighlightedItemVisible = (index: number) => {
    if (index < 0 || !dropdownRef.current) return;
    
    const listItems = dropdownRef.current.querySelectorAll("button");
    if (index >= listItems.length) return;
    
    const item = listItems[index];
    const container = dropdownRef.current;
    
    if (item) {
      const itemTop = item.offsetTop;
      const itemBottom = itemTop + item.offsetHeight;
      const containerTop = container.scrollTop;
      const containerBottom = containerTop + container.offsetHeight;
      
      if (itemTop < containerTop) {
        // Scroll up to show the item at the top
        container.scrollTop = itemTop;
      } else if (itemBottom > containerBottom) {
        // Scroll down to show the item at the bottom
        container.scrollTop = itemBottom - container.offsetHeight;
      }
    }
  };

  return (
    <div className="w-full">
      {/* Search bar */}
      <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search countries..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setHighlightedIndex(-1); // Reset highlight when search changes
            }}
            onKeyDown={handleKeyDown}
            className="pl-8 pr-8 w-full"
            autoComplete="off"
          />
          {searchTerm && (
            <button 
              className="absolute right-2 top-2.5"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="p-4 text-center text-gray-500">Loading countries...</div>
      ) : filteredCountries.length > 0 ? (
        <div ref={dropdownRef} className="max-h-60 overflow-y-auto">
          {filteredCountries.map((country, index) => (
            <Button 
              key={country.country_id} 
              type="button" 
              variant="ghost" 
              className={`w-full flex items-center justify-between px-4 py-2 text-left h-auto ${
                selectedCountry === country.country_id ? "bg-gray-100" : ""
              } ${
                highlightedIndex === index ? "bg-gray-100" : ""
              }`} 
              onClick={() => handleCountrySelect(country.country_id, country.country_flag)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <div className="flex items-center gap-2">
                <span className="inline-block w-6 text-center">{country.country_flag}</span>
                <span className="truncate">{country.country_name}</span>
              </div>
            </Button>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500">No countries found</div>
      )}
    </div>
  );
};

export default CountryDropdown;
