
import { ColumnDef, TableRow } from "@/types/table";
import { TableHeader } from "./TableHeader";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { RefObject } from "react";

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
  return (
    <div className="flex flex-col h-full">
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
      <div className="flex-1">
        <div className="bg-[#d3e4fd] p-4 mb-2">
          <Button 
            onClick={handleAdd}
            className="w-[100px] h-[40px] rounded-full bg-[#ecb652] text-[16px] text-[#154851] font-bold border-2 border-white"
          >
            Add
          </Button>
        </div>
        <div className="bg-white">
          {data.map(row => (
            <div key={row.id} className="p-4 border-b whitespace-nowrap">
              {new Date(row[column.field]).toLocaleDateString('en-US', {
                month: 'numeric',
                day: 'numeric',
                year: '2-digit'
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
