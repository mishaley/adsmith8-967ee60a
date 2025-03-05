
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CollapsibleSection from "../CollapsibleSection";
import { useLanguages } from "./hooks/useLanguages";

interface LanguagesSectionProps {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
}

const LanguagesSection: React.FC<LanguagesSectionProps> = ({
  selectedLanguage,
  setSelectedLanguage
}) => {
  const { languages, isLoading, error } = useLanguages();
  
  // Find the display value with emoji for the selected language
  const getDisplayValue = () => {
    const language = languages.find(lang => lang.code === selectedLanguage);
    return language ? language.display : "Select language";
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
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue>
                      {isLoading ? "Loading languages..." : getDisplayValue()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-white min-w-[var(--radix-select-trigger-width)] w-fit">
                    {error && (
                      <div className="p-2 text-red-500 text-sm">Error loading languages</div>
                    )}
                    {!error && languages.length === 0 && !isLoading && (
                      <div className="p-2 text-gray-500 text-sm">No languages available</div>
                    )}
                    {languages.map(language => (
                      <SelectItem key={language.code} value={language.code}>
                        {language.display}
                      </SelectItem>
                    ))}
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
