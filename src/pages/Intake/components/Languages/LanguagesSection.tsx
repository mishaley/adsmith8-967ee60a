
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LanguagesSectionProps {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
}

// Language emoji mapping
const LANGUAGES_WITH_EMOJIS = [
  { code: "English", emoji: "🇬🇧", display: "🇬🇧 English" },
  { code: "Spanish", emoji: "🇪🇸", display: "🇪🇸 Spanish" },
  { code: "French", emoji: "🇫🇷", display: "🇫🇷 French" },
  { code: "German", emoji: "🇩🇪", display: "🇩🇪 German" },
  { code: "Italian", emoji: "🇮🇹", display: "🇮🇹 Italian" },
  { code: "Portuguese", emoji: "🇵🇹", display: "🇵🇹 Portuguese" },
  { code: "Russian", emoji: "🇷🇺", display: "🇷🇺 Russian" },
  { code: "Japanese", emoji: "🇯🇵", display: "🇯🇵 Japanese" },
  { code: "Chinese", emoji: "🇨🇳", display: "🇨🇳 Chinese" },
  { code: "Korean", emoji: "🇰🇷", display: "🇰🇷 Korean" },
  { code: "Arabic", emoji: "🇸🇦", display: "🇸🇦 Arabic" },
  { code: "Hindi", emoji: "🇮🇳", display: "🇮🇳 Hindi" },
  { code: "Dutch", emoji: "🇳🇱", display: "🇳🇱 Dutch" },
  { code: "Swedish", emoji: "🇸🇪", display: "🇸🇪 Swedish" },
  { code: "Turkish", emoji: "🇹🇷", display: "🇹🇷 Turkish" },
  { code: "Polish", emoji: "🇵🇱", display: "🇵🇱 Polish" },
  { code: "Vietnamese", emoji: "🇻🇳", display: "🇻🇳 Vietnamese" },
  { code: "Thai", emoji: "🇹🇭", display: "🇹🇭 Thai" },
  { code: "Greek", emoji: "🇬🇷", display: "🇬🇷 Greek" },
  { code: "Hebrew", emoji: "🇮🇱", display: "🇮🇱 Hebrew" }
];

const LanguagesSection: React.FC<LanguagesSectionProps> = ({
  selectedLanguage,
  setSelectedLanguage
}) => {
  // Find the display value with emoji for the selected language
  const getDisplayValue = () => {
    const language = LANGUAGES_WITH_EMOJIS.find(lang => lang.code === selectedLanguage);
    return language ? language.display : "Select language";
  };

  return (
    <div className="bg-[#e9f2fe] p-4 mb-6 rounded-lg">
      <h2 className="text-center text-gray-700 mb-4 font-bold text-xl">LANGUAGES</h2>
      <table className="w-full border-collapse border-transparent">
        <tbody>
          <tr className="border-transparent">
            <td colSpan={2} className="py-4 text-center">
              <div className="inline-block min-w-[180px]">
                <Select 
                  value={selectedLanguage} 
                  onValueChange={value => setSelectedLanguage(value)}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue>
                      {getDisplayValue()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-white min-w-[var(--radix-select-trigger-width)] w-fit">
                    {LANGUAGES_WITH_EMOJIS.map(language => (
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
    </div>
  );
};

export default LanguagesSection;
