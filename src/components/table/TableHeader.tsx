
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

  const buttonBaseStyles = [
    "w-full",
    "text-left",
    "px-4",
    "py-1.5",
    "text-sm",
    "font-normal",
    "text-white",
    "bg-transparent",
    "border-0",
    "outline-none",
    "transition-all",
    "duration-75"
  ].join(" ");

  const buttonHoverStyles = "hover:bg-[#363636] hover:text-[#ecb652]";

  if (!isPopoverContent) {
    return (
      <div className="flex items-center justify-between space-x-2 w-full h-full relative group">
        <span className="truncate block">{column.header}</span>
        <ChevronDown className="h-4 w-4 text-white shrink-0" />
      </div>
    );
  }

  return (
    <>
      {column.field === 'created_at' ? (
        <>
          <button 
            className={`${buttonBaseStyles} ${buttonHoverStyles}`}
            onClick={() => handleCreatedSort('desc')}
            onMouseLeave={(e) => e.currentTarget.blur()}
          >
            New → Old
          </button>
          <button 
            className={`${buttonBaseStyles} ${buttonHoverStyles}`}
            onClick={() => handleCreatedSort('asc')}
            onMouseLeave={(e) => e.currentTarget.blur()}
          >
            Old → New
          </button>
        </>
      ) : (
        <>
          <button 
            className={`${buttonBaseStyles} ${buttonHoverStyles}`}
            onClick={() => handleFixedSort('asc')}
            onMouseLeave={(e) => e.currentTarget.blur()}
          >
            A → Z
          </button>
          <button 
            className={`${buttonBaseStyles} ${buttonHoverStyles}`}
            onClick={() => handleFixedSort('desc')}
            onMouseLeave={(e) => e.currentTarget.blur()}
          >
            Z → A
          </button>
          <div className="h-[1px] bg-[#363636] my-1" />
          <button 
            className={`${buttonBaseStyles} ${buttonHoverStyles}`}
            onClick={() => clearFilter(column.field)}
            onMouseLeave={(e) => e.currentTarget.blur()}
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
