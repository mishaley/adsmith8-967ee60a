
import { TableHeader } from "./TableHeader";
import { useState, useEffect } from "react";
import { useTableMutations } from "./TableMutations";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { TableCellEditor } from "./components/TableCellEditor";
import { TableNewRecordInput } from "./components/TableNewRecordInput";
import { TableColumnProps, EditingCell } from "./types/column-types";
import { TableRow } from "@/types/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const handleSelect = (rowId: string, field: string, newValue: string) => {
    console.log('Handling select with:', { rowId, field, newValue });
    const row = data.find(r => r.id === rowId);
    if (!row) return;
    
    const oldValue = row[field];
    console.log('Current value in row:', oldValue);
    console.log('New selected value:', newValue);
    
    updateMutation.mutate({ 
      rowId, 
      field, 
      value: newValue,
      currentValue: oldValue
    });
    setEditingCell({ rowId: null, field: null });
  };

  const handleCellClick = (rowId: string, field: string) => {
    if (column.editable) {
      setEditingCell({ rowId, field });
    }
  };

  const renderCell = (row: TableRow) => {
    const isEditing = editingCell.rowId === row.id && editingCell.field === column.field;
    const displayValue = column.displayField ? row[column.displayField] : row[column.field];

    if (isEditing && column.inputMode === 'select' && column.options) {
      return (
        <div className="w-full relative select-wrapper" onClick={(e) => e.stopPropagation()}>
          <Select
            defaultValue={row[column.field]}
            onValueChange={(value) => handleSelect(row.id, column.field, value)}
          >
            <SelectTrigger className="w-full h-full bg-transparent border-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {column.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (isEditing && column.inputMode === 'text') {
      return (
        <input
          autoFocus
          defaultValue={row[column.field]}
          onBlur={(e) => handleSelect(row.id, column.field, e.target.value)}
          className="absolute inset-0 bg-transparent outline-none p-0 m-0 border-none focus:ring-0 text-base"
        />
      );
    }

    return (
      <div className="truncate text-base">
        {displayValue}
      </div>
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
          />
        </div>
        <div className="bg-white">
          {data.map(row => (
            <div 
              key={row.id} 
              className={`p-4 border-b whitespace-nowrap cursor-pointer hover:bg-gray-50 ${
                editingCell.rowId === row.id && editingCell.field === column.field ? 'ring-2 ring-inset ring-[#ecb652]' : ''
              }`}
              onClick={() => handleCellClick(row.id, column.field)}
            >
              {renderCell(row)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
