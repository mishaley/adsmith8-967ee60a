import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
interface LanguagesSectionProps {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
}
const LANGUAGES = ["English", "Spanish", "French", "German", "Italian", "Portuguese", "Russian", "Japanese", "Chinese", "Korean", "Arabic", "Hindi", "Dutch", "Swedish", "Turkish", "Polish", "Vietnamese", "Thai", "Greek", "Hebrew"];
const LanguagesSection: React.FC<LanguagesSectionProps> = ({
  selectedLanguage,
  setSelectedLanguage
}) => {
  return <div className="bg-[#e9f2fe] p-4 mb-6 rounded-lg">
      <h2 className="text-center text-gray-700 mb-4 font-bold text-xl">LANGUAGES</h2>
      <table className="w-full border-collapse">
        <tbody>
          <tr className="border-b">
            
          </tr>
          <tr>
            <td colSpan={2} className="py-4 pl-4">
              <div className="inline-block min-w-[180px]">
                <Select value={selectedLanguage} onValueChange={value => setSelectedLanguage(value)}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="bg-white min-w-[var(--radix-select-trigger-width)] w-fit">
                    {LANGUAGES.map(language => <SelectItem key={language} value={language}>
                        {language}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>;
};
export default LanguagesSection;