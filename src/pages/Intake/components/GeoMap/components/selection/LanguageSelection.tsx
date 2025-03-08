
import React, { useEffect, useState } from "react";
import { useLanguages } from "../../../Languages/hooks/useLanguages";
import SelectionHeader from "./SelectionHeader";
import { EnhancedDropdown, DropdownOption } from "@/components/ui/enhanced-dropdown";

interface LanguageSelectionProps {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  isLoadingCountry: boolean;
  primaryLanguageId: string | null;
  hideLabel?: boolean;
  multiSelect?: boolean;
  selectedLanguages?: string[];
  setSelectedLanguages?: ((languages: string[]) => void) | null;
}

const LanguageSelection: React.FC<LanguageSelectionProps> = ({
  selectedLanguage,
  setSelectedLanguage,
  isLoadingCountry,
  primaryLanguageId,
  hideLabel = false,
  multiSelect = false,
  selectedLanguages = [],
  setSelectedLanguages = null
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
    if (selectedIds.length === 0) {
      setSelectedLanguage("");
      
      // Update multi-select state if available
      if (multiSelect && setSelectedLanguages) {
        setSelectedLanguages([]);
      }
      return;
    }
    
    // Update multi-select state if available
    if (multiSelect && setSelectedLanguages) {
      setSelectedLanguages(selectedIds);
      
      // Also update single select for backward compatibility
      if (selectedIds.length > 0) {
        setSelectedLanguage(selectedIds[0]);
      } else {
        setSelectedLanguage("");
      }
    } else {
      // For single select, use the first selected item
      setSelectedLanguage(selectedIds[0]);
    }
  };

  return (
    <div>
      {!hideLabel && <SelectionHeader title="Language" />}
      
      <EnhancedDropdown
        options={languageOptions}
        selectedItems={multiSelect && selectedLanguages.length > 0 ? selectedLanguages : (selectedLanguage ? [selectedLanguage] : [])}
        onSelectionChange={handleLanguageSelect}
        placeholder="Select language"
        searchPlaceholder="Search languages..."
        disabled={isLoading}
        multiSelect={multiSelect}
      />
      
      {isLoadingCountry && primaryLanguageId && (
        <div className="mt-2 text-sm text-gray-500">
          Loading language for selected country...
        </div>
      )}
    </div>
  );
};

export default LanguageSelection;
