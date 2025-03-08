
import React from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { SearchBarProps } from "./types";

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  searchPlaceholder,
  inputRef,
}) => {
  return (
    <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-100">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          className="pl-8 pr-8 w-full"
          autoComplete="off"
        />
        {searchTerm && (
          <button 
            className="absolute right-2 top-2.5"
            onClick={() => {
              setSearchTerm("");
              if (inputRef.current) {
                inputRef.current.focus();
              }
            }}
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
