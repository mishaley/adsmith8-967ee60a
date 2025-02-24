
import { ColumnDef } from "@/types/table";
import { ChevronDown, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
}

export function TableHeader({
  column,
  handleSort,
  handleFilter,
  clearFilter,
  filters,
  searchInputRef
}: TableHeaderProps) {
  return (
    <div className="flex items-center justify-between space-x-2 w-full">
      <span className="truncate">{column.header}</span>
      <Popover>
        <PopoverTrigger asChild>
          <ChevronDown className="h-4 w-4 text-white cursor-pointer" />
        </PopoverTrigger>
        <PopoverContent 
          className="w-[var(--radix-popover-content-width)] p-0 -mt-[1px] rounded-none shadow border border-gray-200" 
          align="start" 
          side="bottom"
          alignOffset={-8}
          sideOffset={-32}
        >
          <div className="py-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start px-4 py-1.5 text-sm font-normal hover:bg-gray-100" 
              onClick={() => handleSort(column.field)}
            >
              Sort A → Z
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start px-4 py-1.5 text-sm font-normal hover:bg-gray-100" 
              onClick={() => handleSort(column.field)}
            >
              Sort Z → A
            </Button>
            <div className="h-[1px] bg-gray-200 my-1" />
            <Button 
              variant="ghost" 
              size="sm"
              className="w-full justify-start px-4 py-1.5 text-sm font-normal hover:bg-gray-100"
              onClick={() => clearFilter(column.field)}
            >
              Clear
            </Button>
            <div className="px-3 py-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  ref={searchInputRef}
                  placeholder="Search..."
                  value={filters[column.field] || ""}
                  onChange={(e) => handleFilter(column.field, e.target.value)}
                  className="pl-8 h-9 border-gray-200"
                  autoFocus
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
