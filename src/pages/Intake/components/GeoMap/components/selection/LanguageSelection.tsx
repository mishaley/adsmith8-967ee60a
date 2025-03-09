
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
    
    // In multi-select mode with setSelectedLanguages provided, use full array handling
    if (multiSelect && setSelectedLanguages) {
      setSelectedLanguages(selectedIds);
      
      // For backward compatibility, also update single-select
      if (selectedIds.length > 0) {
        setSelectedLanguage(selectedIds[0]);
      } else {
        setSelectedLanguage("");
      }
    } else {
      // Legacy single-select fallback
      if (selectedIds.length > 0) {
        setSelectedLanguage(selectedIds[0]);
      } else {
        setSelectedLanguage("");
      }
    }
  };

  return (
    <div>
      {!hideLabel && <SelectionHeader title="Language" />}
      
      <EnhancedDropdown
        options={languageOptions}
        selectedItems={multiSelect && setSelectedLanguages ? selectedLanguages : (selectedLanguage ? [selectedLanguage] : [])}
        onSelectionChange={handleLanguageSelect}
        placeholder="Select language"
        searchPlaceholder="Search languages..."
        disabled={isLoading}
        multiSelect={multiSelect && setSelectedLanguages !== null}
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
