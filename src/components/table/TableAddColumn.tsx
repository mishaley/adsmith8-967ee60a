import { ColumnDef, TableRow } from "@/types/table";
import { TableHeader } from "./TableHeader";
import { Button } from "@/components/ui/button";
import { RefObject } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

interface TableAddColumnProps {
  column: ColumnDef;
  data: TableRow[];
  handleAdd: () => void;
  handleSort: (field: string) => void;
  handleFilter: (field: string, value: string) => void;
  clearFilter: (field: string) => void;
  filters: Record<string, string>;
  searchInputRef: RefObject<HTMLInputElement>;
}

export function TableAddColumn({
  column,
  data,
  handleAdd,
  handleSort,
  handleFilter,
  clearFilter,
  filters,
  searchInputRef
}: TableAddColumnProps) {
  return <div className="flex flex-col h-full">
      <Popover>
        <PopoverTrigger asChild>
          <div className="bg-[#154851] p-4 text-white text-[16px] whitespace-nowrap uppercase font-semibold cursor-pointer hover:bg-[#1a5a65] group">
            <TableHeader 
              column={column} 
              handleSort={handleSort} 
              handleFilter={handleFilter} 
              clearFilter={clearFilter} 
              filters={filters} 
              searchInputRef={searchInputRef} 
            />
          </div>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[var(--radix-popper-anchor-width)] p-0 rounded-none shadow-none border-0 mt-0 bg-[#2A2A2A] text-white" 
          align="start"
          side="bottom"
          sideOffset={0}
          avoidCollisions={false}
        >
          <div className="py-1">
            <TableHeader 
              column={column} 
              handleSort={handleSort} 
              handleFilter={handleFilter} 
              clearFilter={clearFilter} 
              filters={filters} 
              searchInputRef={searchInputRef}
              isPopoverContent={true}
            />
          </div>
        </PopoverContent>
      </Popover>
      <div className="flex-1">
        <div className="bg-[#d3e4fd] p-4 mb-2">
          <Button onClick={handleAdd} className="w-[100px] h-[40px] rounded-full bg-[#ecb652] hover:bg-[#ecb652] text-[16px] text-[#154851] font-bold border-2 border-white">ADD</Button>
        </div>
        <div className="bg-white">
          {data.map(row => <div key={row.id} className="p-4 border-b whitespace-nowrap">
              {new Date(row[column.field]).toLocaleDateString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: '2-digit'
          })}
            </div>)}
        </div>
      </div>
    </div>;
}
