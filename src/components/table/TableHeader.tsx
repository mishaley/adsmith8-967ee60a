
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
    <div className="h-full">
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex items-center justify-between space-x-2 w-full relative group cursor-pointer">
            <span className="truncate">{column.header}</span>
            <ChevronDown className="h-4 w-4 text-white" />
          </div>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[calc(100%+32px)] p-0 rounded-none shadow border-0 mt-0 -ml-4 bg-[#2A2A2A] text-white" 
          align="start" 
          side="bottom"
          sideOffset={16}
          alignOffset={0}
          avoidCollisions={false}
          sticky="always"
        >
          <div className="py-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start px-4 py-1.5 text-sm font-normal text-white hover:bg-[#363636]" 
              onClick={() => handleSort(column.field)}
            >
              Sort A → Z
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start px-4 py-1.5 text-sm font-normal text-white hover:bg-[#363636]" 
              onClick={() => handleSort(column.field)}
            >
              Sort Z → A
            </Button>
            <div className="h-[1px] bg-[#363636] my-1" />
            <Button 
              variant="ghost" 
              size="sm"
              className="w-full justify-start px-4 py-1.5 text-sm font-normal text-white hover:bg-[#363636]"
              onClick={() => clearFilter(column.field)}
            >
              Clear
            </Button>
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
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
