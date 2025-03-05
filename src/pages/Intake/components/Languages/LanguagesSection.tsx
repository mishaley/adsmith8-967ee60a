
import React, { useState, useRef, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import CollapsibleSection from "../CollapsibleSection";
import { useLanguages } from "./hooks/useLanguages";
import { useCountryLanguage } from "./hooks/useCountryLanguage";

interface LanguagesSectionProps {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  selectedCountry: string;
}

const LanguagesSection: React.FC<LanguagesSectionProps> = ({
  selectedLanguage,
  setSelectedLanguage,
  selectedCountry
}) => {
  const { languages, isLoading: isLoadingLanguages, error: languagesError } = useLanguages();
  const { primaryLanguageId, isLoading: isLoadingCountry, error: countryError } = useCountryLanguage(selectedCountry);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Filter languages based on search query
  const filteredLanguages = languages.filter(language => 
    language.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    language.native.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Find the display value with emoji for the selected language
  const getDisplayValue = () => {
    const language = languages.find(lang => lang.code === selectedLanguage);
    return language ? language.display : "Select language";
  };

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
  }, [isOpen]);

  // Update selected language when primary language from country changes
  useEffect(() => {
    if (primaryLanguageId && !isLoadingCountry) {
      setSelectedLanguage(primaryLanguageId);
    } else if (!selectedCountry) {
      // Clear language selection if no country is selected
      setSelectedLanguage("");
    }
  }, [primaryLanguageId, isLoadingCountry, selectedCountry, setSelectedLanguage]);

  // Prevent default behavior for keydown events to avoid losing focus
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent propagation of keyboard events that might cause dropdown to close
    if (e.key !== 'Escape' && e.key !== 'Tab') {
      e.stopPropagation();
    }
  };

  // Handle input change without losing focus
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Ensure input maintains focus
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <CollapsibleSection title="LANGUAGES">
      <table className="w-full border-collapse border-transparent">
        <tbody>
          <tr className="border-transparent">
            <td colSpan={2} className="py-4 text-center">
              <div className="inline-block min-w-[180px]">
                <Select 
                  value={selectedLanguage} 
                  onValueChange={value => setSelectedLanguage(value)}
                  disabled={isLoadingLanguages || isLoadingCountry}
                  onOpenChange={(open) => {
                    setIsOpen(open);
                    if (!open) {
                      setSearchQuery(""); // Clear search when dropdown closes
                    }
                  }}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue>
                      {isLoadingLanguages || isLoadingCountry ? "Loading languages..." : getDisplayValue()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-white min-w-[var(--radix-select-trigger-width)] w-fit">
                    <div className="p-2 sticky top-0 bg-white z-10 border-b">
                      <Input
                        ref={searchInputRef}
                        placeholder="Search languages..."
                        value={searchQuery}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        className="h-8"
                        autoComplete="off"
                      />
                    </div>
                    <ScrollArea className="h-[200px] w-full">
                      {(languagesError || countryError) && (
                        <div className="p-2 text-red-500 text-sm">Error loading data</div>
                      )}
                      {!languagesError && filteredLanguages.length === 0 && !isLoadingLanguages && (
                        <div className="p-2 text-gray-500 text-sm">
                          {languages.length === 0 ? "No languages available" : "No matching languages found"}
                        </div>
                      )}
                      {filteredLanguages.map(language => (
                        <SelectItem key={language.code} value={language.code}>
                          {language.display}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </CollapsibleSection>
  );
};

export default LanguagesSection;
