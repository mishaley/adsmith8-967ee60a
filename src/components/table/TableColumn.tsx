
import { TableHeader } from "./TableHeader";
import { useState } from "react";
import { useTableMutations } from "./TableMutations";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
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
  tableName,
  idField
}: TableColumnProps) {
  const [editingCell, setEditingCell] = useState<EditingCell>({ rowId: null, field: null });
  const { mutate } = useTableMutations(tableName, idField);

  const isCreatedColumn = column.field === 'created_at';

  const handleSelect = (rowId: string, field: string, newValue: string) => {
    mutate({ 
      rowId, 
      field, 
      value: newValue,
      currentValue: ''
    });
    setEditingCell({ rowId: null, field: null });
  };

  const handleCellClick = (rowId: string, field: string) => {
    if (column.editable) {
      setEditingCell({ rowId, field });
    }
  };

  const getColumnWidth = () => {
    // For Age Min and Age Max columns, let them be as wide as their headers
    if (column.field === 'persona_agemin' || column.field === 'persona_agemax') {
      return 'min-content';
    }
    if (column.field === 'message_name') return 'max-content';
    return 'auto';
  };

  const renderCell = (row: TableRow) => {
    const isEditing = editingCell.rowId === row.id && editingCell.field === column.field;
    const displayValue = column.displayField ? row[column.displayField] : row[column.field];

    if (isEditing && column.inputMode === 'select' && column.options) {
      const currentFilter = filters[column.field]?.toLowerCase() || '';
      const filteredOptions = column.options.filter(option => {
        if (!currentFilter) return true;
        return option.label.toLowerCase().includes(currentFilter);
      });

      return (
        <Select
          defaultValue={row[column.field]}
          onValueChange={(value) => handleSelect(row.id, column.field, value)}
          defaultOpen={true}
          onOpenChange={(open) => {
            if (!open) {
              setEditingCell({ rowId: null, field: null });
            }
          }}
        >
          <SelectTrigger className="w-full h-full border-none shadow-none focus:ring-0 px-0 bg-transparent text-base font-normal flex items-center">
            <SelectValue className="text-left" placeholder={displayValue} />
          </SelectTrigger>
          <SelectContent 
            className="bg-white border rounded-md shadow-md z-50 min-w-[200px]"
            position="popper"
            sideOffset={5}
          >
            {filteredOptions.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-base"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (isEditing && column.inputMode === 'text') {
      return (
        <div className="w-full" onClick={(e) => e.stopPropagation()}>
          <input
            autoFocus
            defaultValue={row[column.field]}
            onBlur={(e) => handleSelect(row.id, column.field, e.target.value)}
            className={`w-full bg-transparent outline-none focus:ring-0 text-base p-0 ${isCreatedColumn ? 'text-center' : 'text-left'}`}
          />
        </div>
      );
    }

    return (
      <div className={`text-base whitespace-nowrap ${isCreatedColumn ? 'text-center' : 'text-left'}`}>
        {displayValue}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full" style={{ width: getColumnWidth() }}>
      <Popover>
        <PopoverTrigger asChild>
          <div className="whitespace-nowrap bg-[#154851] p-4 text-white text-[16px] uppercase font-semibold cursor-pointer hover:bg-[#1a5a65] group">
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
            cellContentClass={`text-base ${isCreatedColumn ? 'text-center' : 'text-left'}`}
          />
        </div>
        <div className="bg-white">
          {data.map(row => (
            <div 
              key={row.id} 
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
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
