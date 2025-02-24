
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
            <div className="flex items-center justify-between space-x-2 w-full h-full relative group">
              <TableHeader 
                column={column} 
                handleSort={handleSort} 
                handleFilter={handleFilter} 
                clearFilter={clearFilter} 
                filters={filters} 
                searchInputRef={searchInputRef} 
              />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[calc(var(--radix-popper-anchor-width)+32px)] p-0 rounded-none shadow border-0 mt-0 bg-[#2A2A2A] text-white" 
          align="start"
          alignOffset={-16}
          side="bottom"
          sideOffset={16}
          avoidCollisions={false}
          sticky="always"
        >
          <div className="py-1">
            <TableHeader 
              column={column} 
              handleSort={handleSort} 
              handleFilter={handleFilter} 
              clearFilter={clearFilter} 
              filters={filters} 
              searchInputRef={searchInputRef} 
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
