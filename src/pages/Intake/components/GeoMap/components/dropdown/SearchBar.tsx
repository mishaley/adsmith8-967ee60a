
import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  setHighlightedIndex: (index: number) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  onKeyDown,
  setHighlightedIndex
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Clear search term
  const clearSearch = () => {
    setSearchTerm("");
    setHighlightedIndex(-1);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-50">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          ref={searchInputRef}
          type="text"
          placeholder="Search countries..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setHighlightedIndex(-1); // Reset highlight when search changes
          }}
          onKeyDown={onKeyDown}
          className="pl-8 pr-8 w-full border-gray-100"
          autoComplete="off"
        />
        {searchTerm && (
          <button 
            className="absolute right-2 top-2.5"
            onClick={clearSearch}
            aria-label="Clear search"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
