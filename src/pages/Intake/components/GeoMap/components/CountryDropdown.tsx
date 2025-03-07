
import React, { useState, useEffect, useRef } from "react";
import { useCountries } from "../hooks/useCountries";
import SearchBar from "./dropdown/SearchBar";
import WorldwideOption from "./dropdown/WorldwideOption";
import CountryList from "./dropdown/CountryList";
import ClearSelectionButton from "./dropdown/ClearSelectionButton";
import useKeyboardNavigation from "./dropdown/useKeyboardNavigation";

interface CountryDropdownProps {
  selectedCountry: string;
  setSelectedCountry: (country: string, flag?: string) => void;
  setSelectedCountryId?: ((id: string) => void) | null;
  isExcludeDropdown?: boolean;
}

const CountryDropdown: React.FC<CountryDropdownProps> = ({
  selectedCountry,
  setSelectedCountry,
  setSelectedCountryId,
  isExcludeDropdown = false
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { countries, isLoading } = useCountries();
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      
      // Special case for worldwide selection
      if (countryId === "worldwide") {
        console.log("Selecting all countries (worldwide)");
        setSelectedCountryId("worldwide");
        return;
      }
      
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

  // Handle worldwide selection
  const handleWorldwideSelect = () => {
    handleCountrySelect("worldwide", "🌐");
  };

  // For exclude dropdown, we don't include the worldwide option
  const allOptions = isExcludeDropdown 
    ? [...filteredCountries.map(c => c.country_id)]
    : ["worldwide", ...filteredCountries.map(c => c.country_id)];

  // Handle keyboard selection of a country
  const handleSelectFromKeyboard = (highlightIndex: number) => {
    const countryIndex = isExcludeDropdown ? highlightIndex : highlightIndex - 1;
    if (countryIndex >= 0 && countryIndex < filteredCountries.length) {
      const country = filteredCountries[countryIndex];
      handleCountrySelect(country.country_id, country.country_flag);
    }
  };

  // Keyboard navigation
  const { handleKeyDown } = useKeyboardNavigation({
    highlightedIndex,
    setHighlightedIndex,
    ensureHighlightedItemVisible,
    options: allOptions,
    isExcludeDropdown,
    onWorldwideSelect: handleWorldwideSelect,
    onCountrySelect: handleSelectFromKeyboard,
    clearSearch
  });

  return (
    <div className="w-full" style={{ zIndex: 50 }}>
      {/* Search bar */}
      <SearchBar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        onKeyDown={handleKeyDown}
        setHighlightedIndex={setHighlightedIndex}
      />

      {isLoading ? (
        <div className="p-4 text-center text-gray-500">Loading countries...</div>
      ) : (
        <div ref={dropdownRef} className="max-h-80 overflow-y-auto" style={{ maxHeight: '300px' }}>
          {/* Worldwide option at the top - only show for non-exclude dropdowns */}
          {!isExcludeDropdown && (
            <WorldwideOption 
              selectedCountry={selectedCountry}
              highlightedIndex={highlightedIndex}
              onSelect={handleWorldwideSelect}
              onMouseEnter={() => setHighlightedIndex(0)}
            />
          )}
          
          {/* Country list */}
          <CountryList 
            filteredCountries={filteredCountries}
            selectedCountry={selectedCountry}
            highlightedIndex={highlightedIndex}
            onSelect={handleCountrySelect}
            setHighlightedIndex={setHighlightedIndex}
            isExcludeDropdown={isExcludeDropdown}
          />
        </div>
      )}
      
      {/* Clear selection button at the bottom */}
      <ClearSelectionButton 
        onClear={() => {
          setSelectedCountry("");
          if (setSelectedCountryId) {
            setSelectedCountryId("");
          }
        }}
        disabled={!selectedCountry}
      />
    </div>
  );
};

export default CountryDropdown;
