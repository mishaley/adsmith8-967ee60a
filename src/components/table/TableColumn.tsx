
import { TableHeader } from "./TableHeader";
import { useState } from "react";
import { useTableMutations } from "./TableMutations";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { TableNewRecordInput } from "./components/TableNewRecordInput";
import { TableColumnProps, EditingCell } from "./types/column-types";
import { TableRow } from "@/types/table";
import { TableImageCell } from "./components/TableImageCell";
import { TableSelectCell } from "./components/TableSelectCell";
import { TableTextCell } from "./components/TableTextCell";

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
  const isImageColumn = column.format === 'image';

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
    if (isImageColumn) return '120px';
    if (column.field === 'persona_agemin' || column.field === 'persona_agemax') {
      return 'min-content';
    }
    if (column.field === 'message_name') return 'max-content';
    return 'auto';
  };

  const renderCell = (row: TableRow) => {
    const isEditing = editingCell.rowId === row.id && editingCell.field === column.field;
    const displayValue = column.displayField ? row[column.displayField] : row[column.field];

    if (isImageColumn && row[column.field]) {
      return <TableImageCell imagePath={row[column.field]} />;
    }

    if (isEditing && column.inputMode === 'select' && column.options) {
      const currentFilter = filters[column.field]?.toLowerCase() || '';
      const filteredOptions = column.options.filter(option => {
        if (!currentFilter) return true;
        return option.label.toLowerCase().includes(currentFilter);
      });

      return (
        <TableSelectCell
          value={row[column.field]}
          displayValue={displayValue}
          options={filteredOptions}
          onSelect={(value) => handleSelect(row.id, column.field, value)}
          onOpenChange={(open) => {
            if (!open) {
              setEditingCell({ rowId: null, field: null });
            }
          }}
        />
      );
    }

    if (isEditing && column.inputMode === 'text') {
      return (
        <TableTextCell
          value={row[column.field]}
          onBlur={(value) => handleSelect(row.id, column.field, value)}
          isCenter={isCreatedColumn}
        />
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
