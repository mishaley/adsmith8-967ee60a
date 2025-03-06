
import React, { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface LanguageSearchInputProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isDropdownOpen: boolean;
}

const LanguageSearchInput: React.FC<LanguageSearchInputProps> = ({
  searchTerm,
  setSearchTerm,
  onKeyDown,
  isDropdownOpen
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus the search input when the dropdown is opened
  useEffect(() => {
    if (isDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isDropdownOpen]);

  return (
    <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-100">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          ref={searchInputRef}
          type="text"
          placeholder="Search languages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={onKeyDown}
          className="pl-8 pr-8 w-full"
          autoComplete="off"
        />
        {searchTerm && (
          <button 
            className="absolute right-2 top-2.5"
            onClick={() => setSearchTerm("")}
            aria-label="Clear search"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
};

export default LanguageSearchInput;
