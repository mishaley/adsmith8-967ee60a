
import { ColumnDef, TableRow } from "@/types/table";
import { Input } from "@/components/ui/input";
import { TableHeader } from "./TableHeader";
import { RefObject, useState } from "react";
import { useTableMutations } from "./TableMutations";

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
  const [editingCell, setEditingCell] = useState<{ rowId: string | null, field: string | null }>({ rowId: null, field: null });
  const { updateMutation } = useTableMutations("a1organizations", "organization_id");

  const handleCellClick = (rowId: string, field: string) => {
    if (column.editable) {
      setEditingCell({ rowId, field });
    }
  };

  const handleCellBlur = (rowId: string, field: string, value: any) => {
    setEditingCell({ rowId: null, field: null });
    if (column.editable) {
      updateMutation.mutate({ rowId, field, value });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, rowId: string, field: string, value: any) => {
    if (e.key === 'Enter') {
      handleCellBlur(rowId, field, value);
    }
  };

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
          <Input 
            value={newRecord[column.field] || ""} 
            onChange={e => handleInputChange(column.field, e.target.value)} 
            className="h-10 bg-white w-full rounded-md border border-input" 
          />
        </div>
        <div className="bg-white">
          {data.map(row => (
            <div 
              key={row.id} 
              className="p-4 border-b whitespace-nowrap cursor-pointer hover:bg-gray-50"
              onClick={() => handleCellClick(row.id, column.field)}
            >
              {editingCell.rowId === row.id && editingCell.field === column.field ? (
                <Input
                  autoFocus
                  defaultValue={row[column.field]}
                  onBlur={(e) => handleCellBlur(row.id, column.field, e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, row.id, column.field, (e.target as HTMLInputElement).value)}
                  className="h-8 w-full"
                />
              ) : (
                isDate && row[column.field] 
                  ? new Date(row[column.field]).toLocaleDateString('en-US', {
                      month: 'numeric',
                      day: 'numeric',
                      year: '2-digit'
                    })
                  : row[column.field]
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
