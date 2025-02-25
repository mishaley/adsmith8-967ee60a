
import { TableHeader } from "./TableHeader";
import { useState, useEffect } from "react";
import { useTableMutations } from "./TableMutations";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { TableCellEditor } from "./components/TableCellEditor";
import { TableNewRecordInput } from "./components/TableNewRecordInput";
import { TableColumnProps, EditingCell } from "./types/column-types";

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
  const [editingCell, setEditingCell] = useState<EditingCell>({ rowId: null, field: null });
  const { updateMutation } = useTableMutations("b1offerings", "offering_id");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editingCell.rowId && editingCell.field === column.field) {
        const target = event.target as HTMLElement;
        if (!target.closest('.select-wrapper')) {
          const currentRow = data.find(row => row.id === editingCell.rowId);
          handleCellBlur(editingCell.rowId, editingCell.field, currentRow?.[editingCell.field]);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingCell, column.field, data]);

  const handleCellClick = (rowId: string, field: string, event: React.MouseEvent) => {
    if (column.editable) {
      setEditingCell({ rowId, field });
      if (column.inputMode === 'select') {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  };

  const handleCellBlur = (rowId: string, field: string, value: any) => {
    setEditingCell({ rowId: null, field: null });
    if (column.editable) {
      const currentRow = data.find(row => row.id === rowId);
      const currentValue = currentRow?.[field];
      updateMutation.mutate({ rowId, field, value, currentValue });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, rowId: string, field: string, value: any) => {
    if (e.key === 'Enter') {
      handleCellBlur(rowId, field, value);
    }
  };

  const cellContentClass = column.field === 'created_at' ? 'text-center' : '';

  const renderCell = (row: TableRow) => {
    const isEditing = editingCell.rowId === row.id && editingCell.field === column.field;
    const displayValue = column.displayField ? row[column.displayField] : row[column.field];

    if (isEditing) {
      return (
        <TableCellEditor
          row={row}
          column={column}
          onBlur={(value) => handleCellBlur(row.id, column.field, value)}
          cellContentClass={cellContentClass}
          onKeyPress={(e) => handleKeyPress(e, row.id, column.field, (e.target as HTMLInputElement).value)}
        />
      );
    }
    return (
      <div className={`truncate ${cellContentClass} text-base`}>{displayValue}</div>
    );
  };

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
          <TableNewRecordInput
            column={column}
            value={newRecord[column.field]}
            onChange={(value) => handleInputChange(column.field, value)}
            cellContentClass={cellContentClass}
          />
        </div>
        <div className="bg-white">
          {data.map(row => (
            <div 
              key={row.id} 
              className={`p-4 border-b whitespace-nowrap cursor-pointer hover:bg-gray-50 ${
                editingCell.rowId === row.id && editingCell.field === column.field ? 'ring-2 ring-inset ring-[#ecb652]' : ''
              }`}
              onClick={(e) => handleCellClick(row.id, column.field, e)}
            >
              {renderCell(row)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
