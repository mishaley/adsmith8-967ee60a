
import React, { useEffect, useState } from "react";
import { useLanguages } from "../../../Languages/hooks/useLanguages";
import SelectionHeader from "./SelectionHeader";
import { EnhancedDropdown, DropdownOption } from "@/components/ui/enhanced-dropdown";

interface LanguageSelectionProps {
  selectedLanguages: string[];
  setSelectedLanguages: (languages: string[]) => void;
  isLoadingCountry: boolean;
  primaryLanguageId: string | null;
  hideLabel?: boolean;
}

const LanguageSelection: React.FC<LanguageSelectionProps> = ({
  selectedLanguages,
  setSelectedLanguages,
  isLoadingCountry,
  primaryLanguageId,
  hideLabel = false
}) => {
  const { languages, isLoading } = useLanguages();
  const [languageOptions, setLanguageOptions] = useState<DropdownOption[]>([]);
  
  useEffect(() => {
    if (languages.length > 0) {
      // Create dropdown options from languages
      const options: DropdownOption[] = languages.map(language => ({
        id: language.language_id,
        label: language.language_name,
        icon: language.language_flag,
        secondary: language.language_native
      }));
      
      setLanguageOptions(options);
    }
  }, [languages]);

  const handleLanguageSelect = (selectedIds: string[]) => {
    // Always update with the full array of selected languages
    setSelectedLanguages(selectedIds);
  };

  return (
    <div>
      {!hideLabel && <SelectionHeader title="Language" />}
      
      <EnhancedDropdown
        options={languageOptions}
        selectedItems={selectedLanguages}
        onSelectionChange={handleLanguageSelect}
        placeholder=""
        searchPlaceholder="Search languages..."
        disabled={isLoading}
        multiSelect={true}
      />
      
      {isLoading && (
        <div className="mt-2 text-sm text-gray-500">
          Loading languages...
        </div>
      )}
    </div>
  );
};

export default LanguageSelection;
