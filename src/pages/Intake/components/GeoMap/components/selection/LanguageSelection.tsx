
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
      // Clear selection for both single and multi-select
      setSelectedLanguage("");
      if (multiSelect && setSelectedLanguages) {
        setSelectedLanguages([]);
      }
      return;
    }
    
    if (multiSelect && setSelectedLanguages) {
      // In multi-select mode, update the full array of languages
      setSelectedLanguages(selectedIds);
      
      // For backward compatibility, also update single-select with first language
      if (selectedIds.length > 0) {
        setSelectedLanguage(selectedIds[0]);
      } else {
        setSelectedLanguage("");
      }
    } else {
      // In single-select mode (legacy)
      setSelectedLanguage(selectedIds[0]);
    }
  };

  return (
    <div>
      {!hideLabel && <SelectionHeader title="Language" />}
      
      <EnhancedDropdown
        options={languageOptions}
        selectedItems={multiSelect ? selectedLanguages : (selectedLanguage ? [selectedLanguage] : [])}
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
