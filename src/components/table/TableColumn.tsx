
import { ColumnDef, TableRow } from "@/types/table";
import { Input } from "@/components/ui/input";
import { TableHeader } from "./TableHeader";
import { RefObject } from "react";

interface TableColumnProps {
  column: ColumnDef;
  data: TableRow[];
  newRecord: Record<string, any>;
  handleInputChange: (field: string, value: any) => void;
  handleSort: (field: string) => void;
  handleFilter: (field: string, value: string) => void;
  clearFilter: (field: string) => void;
  filters: Record<string, string>;
  searchInputRef: RefObject<HTMLInputElement>;
  isDate?: boolean;
}

export function TableColumn({
  column,
  data,
  newRecord,
  handleInputChange,
  handleSort,
  handleFilter,
  clearFilter,
  filters,
  searchInputRef,
  isDate = false
}: TableColumnProps) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="bg-[#154851] p-4 text-white text-[16px] whitespace-nowrap uppercase font-semibold cursor-pointer hover:bg-[#1a5a65] group rounded-t-md">
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
          <Input 
            value={newRecord[column.field] || ""} 
            onChange={e => handleInputChange(column.field, e.target.value)} 
            className="h-10 bg-white w-full rounded-md border border-input" 
          />
        </div>
        <div className="bg-white rounded-b-md">
          {data.map((row, index) => (
            <div 
              key={row.id} 
              className={`p-4 border-b whitespace-nowrap ${
                index === data.length - 1 ? 'border-b-0' : ''
              }`}
            >
              {isDate && row[column.field] 
                ? new Date(row[column.field]).toLocaleDateString('en-US', {
                    month: 'numeric',
                    day: 'numeric',
                    year: '2-digit'
                  })
                : row[column.field]
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
