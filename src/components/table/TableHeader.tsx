
import { ColumnDef } from "@/types/table";
import { ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefObject } from "react";

interface TableHeaderProps {
  column: ColumnDef;
  handleSort: (field: string) => void;
  handleFilter: (field: string, value: string) => void;
  clearFilter: (field: string) => void;
  filters: Record<string, string>;
  searchInputRef: RefObject<HTMLInputElement>;
  isPopoverContent?: boolean;
}

export function TableHeader({
  column,
  handleSort,
  handleFilter,
  clearFilter,
  filters,
  searchInputRef,
  isPopoverContent = false
}: TableHeaderProps) {
  const handleCreatedSort = (direction: 'asc' | 'desc') => {
    handleSort(`${column.field}:${direction}`);
  };

  const handleFixedSort = (direction: 'asc' | 'desc') => {
    handleSort(`${column.field}:${direction}`);
  };

  const buttonStyles = "w-full text-left px-4 py-1.5 text-sm font-normal text-white hover:bg-[#363636] hover:text-[#ecb652] bg-transparent border-0 focus:outline-none focus:bg-[#363636] focus:text-[#ecb652] active:bg-[#363636] active:text-[#ecb652]";

  if (!isPopoverContent) {
    return (
      <div className="flex items-center justify-between space-x-2 w-full h-full relative group">
        <span className="truncate">{column.header}</span>
        <ChevronDown className="h-4 w-4 text-white" />
      </div>
    );
  }

  return (
    <>
      {column.field === 'created_at' ? (
        <>
          <button 
            className={buttonStyles}
            onClick={() => handleCreatedSort('desc')}
          >
            New → Old
          </button>
          <button 
            className={buttonStyles}
            onClick={() => handleCreatedSort('asc')}
          >
            Old → New
          </button>
        </>
      ) : (
        <>
          <button 
            className={buttonStyles}
            onClick={() => handleFixedSort('asc')}
          >
            A → Z
          </button>
          <button 
            className={buttonStyles}
            onClick={() => handleFixedSort('desc')}
          >
            Z → A
          </button>
          <div className="h-[1px] bg-[#363636] my-1" />
          <button 
            className={buttonStyles}
            onClick={() => clearFilter(column.field)}
          >
            Clear
          </button>
          <div className="px-3 py-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                ref={searchInputRef}
                value={filters[column.field] || ""}
                onChange={(e) => handleFilter(column.field, e.target.value)}
                className="pl-8 h-9 bg-white border-[#464646] text-black"
                autoFocus
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
