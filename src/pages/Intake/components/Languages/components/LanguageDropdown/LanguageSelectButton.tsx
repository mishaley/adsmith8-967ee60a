
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import type { Language } from "../../../Languages/hooks/useLanguages";

interface LanguageSelectButtonProps {
  selectedLanguage: Language | undefined;
  onClick: () => void;
  emptyPlaceholder?: string;
}

const LanguageSelectButton: React.FC<LanguageSelectButtonProps> = ({
  selectedLanguage,
  onClick,
  emptyPlaceholder = "Select language"
}) => {
  return (
    <Button
      variant="outline"
      className="w-full justify-between font-normal"
      onClick={onClick}
    >
      <span className="flex items-center gap-2 text-left truncate">
        {selectedLanguage ? (
          <>
            <span className="inline-block w-6 text-center">{selectedLanguage.language_flag}</span>
            <span>{selectedLanguage.language_name}</span>
          </>
        ) : (
          <span className="text-gray-400">{emptyPlaceholder}</span>
        )}
      </span>
      <ChevronDown className="h-4 w-4 shrink-0" />
    </Button>
  );
};

export default LanguageSelectButton;
