
import React from "react";
import { Button } from "@/components/ui/button";
import type { Language } from "../../../Languages/hooks/useLanguages";

interface LanguageDropdownItemProps {
  language: Language;
  isSelected: boolean;
  isHighlighted: boolean;
  onSelect: (languageId: string) => void;
  onMouseEnter: () => void;
}

const LanguageDropdownItem: React.FC<LanguageDropdownItemProps> = ({
  language,
  isSelected,
  isHighlighted,
  onSelect,
  onMouseEnter
}) => {
  return (
    <Button 
      key={language.language_id} 
      type="button" 
      variant="ghost" 
      className={`w-full flex items-center justify-between px-4 py-2 text-left h-auto ${
        isSelected ? "bg-gray-100" : ""
      } ${
        isHighlighted ? "bg-gray-100" : ""
      }`}
      onClick={() => onSelect(language.language_id)}
      onMouseEnter={onMouseEnter}
    >
      <div className="flex items-center gap-2">
        <span className="inline-block w-6 text-center">{language.language_flag}</span>
        <span className="truncate">{language.language_name}</span>
      </div>
      <span className="text-gray-500 truncate">{language.language_native}</span>
    </Button>
  );
};

export default LanguageDropdownItem;
