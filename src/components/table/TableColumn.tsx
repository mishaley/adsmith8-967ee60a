
import { ColumnDef, TableRow, TableName } from "@/types/table";
import { Input } from "@/components/ui/input";
import { TableHeader } from "./TableHeader";
import { RefObject, useState } from "react";
import { useTableMutations } from "./TableMutations";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Trash } from "lucide-react";

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
}: TableColumnProps) {
  const [editingCell, setEditingCell] = useState<{ rowId: string | null, field: string | null }>({ rowId: null, field: null });
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
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

  const cellContentClass = column.field === 'created_at' ? 'text-center' : '';

  return (
    <div className="flex flex-col h-full">
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
          <Input 
            value={newRecord[column.field] || ""} 
            onChange={e => handleInputChange(column.field, e.target.value)} 
            className={`h-10 bg-white w-full rounded-md border border-input ${cellContentClass}`}
          />
        </div>
        <div className="bg-white">
          {data.map(row => {
            const isEditing = editingCell.rowId === row.id && editingCell.field === column.field;
            const showDeleteButton = column.field === 'created_at' && hoveredRow === row.id;

            return (
              <div 
                key={row.id} 
                className={`p-4 border-b whitespace-nowrap cursor-pointer hover:bg-gray-50 ${isEditing ? 'ring-2 ring-inset ring-[#ecb652]' : ''} relative`}
                onClick={() => handleCellClick(row.id, column.field)}
                onMouseEnter={() => setHoveredRow(row.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {isEditing ? (
                  <div className="w-full relative">
                    <input
                      autoFocus
                      defaultValue={row[column.field]}
                      onBlur={(e) => handleCellBlur(row.id, column.field, e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, row.id, column.field, (e.target as HTMLInputElement).value)}
                      className={`absolute inset-0 bg-transparent outline-none p-0 m-0 border-none focus:ring-0 ${cellContentClass}`}
                    />
                    <div className="invisible">{row[column.field]}</div>
                  </div>
                ) : (
                  <div className={`truncate ${cellContentClass}`}>
                    {row[column.field]}
                    {showDeleteButton && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle delete action here
                          console.log('Delete row:', row.id);
                        }}
                        className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#990000] border border-white flex items-center justify-center hover:bg-[#bb0000] transition-colors"
                      >
                        <Trash className="w-4 h-4 text-white" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
