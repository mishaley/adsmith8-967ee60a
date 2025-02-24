
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
          className="w-full p-0 -mt-1 border-t-0" 
          align="start" 
          sideOffset={0}
        >
          <div className="p-2 space-y-2">
            <div className="space-y-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start" 
                onClick={() => handleSort(column.field)}
              >
                Sort A → Z
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start" 
                onClick={() => handleSort(column.field)}
              >
                Sort Z → A
              </Button>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between mb-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => clearFilter(column.field)}
                >
                  Clear
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  placeholder="Search..."
                  value={filters[column.field] || ""}
                  onChange={(e) => handleFilter(column.field, e.target.value)}
                  className="pl-8"
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
