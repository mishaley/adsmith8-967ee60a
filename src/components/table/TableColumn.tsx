
import { ColumnDef, TableRow } from "@/types/table";
import { Input } from "@/components/ui/input";
import { TableHeader } from "./TableHeader";
import { RefObject, useState, useEffect } from "react";
import { useTableMutations } from "./TableMutations";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const { updateMutation } = useTableMutations("a1organizations", "organization_id");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editingCell.rowId && editingCell.field === column.field) {
        const target = event.target as HTMLElement;
        if (!target.closest('.select-wrapper')) {
          handleCellBlur(editingCell.rowId, editingCell.field, data.find(row => row.id === editingCell.rowId)?.[column.field]);
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
      // If it's a select input, prevent the click from bubbling
      // This allows the Select component to handle the click directly
      if (column.inputMode === 'select') {
        event.preventDefault();
        event.stopPropagation();
      }
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

  const renderInput = () => {
    if (column.inputMode === 'select' && column.options) {
      return (
        <Select
          value={newRecord[column.field] || ""}
          onValueChange={(value) => handleInputChange(column.field, value)}
        >
          <SelectTrigger className="h-10 bg-white w-full rounded-md border border-input">
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
      );
    }
    return (
      <Input 
        value={newRecord[column.field] || ""} 
        onChange={e => handleInputChange(column.field, e.target.value)} 
        className={`h-10 bg-white w-full rounded-md border border-input ${cellContentClass}`}
      />
    );
  };

  const renderCell = (row: TableRow) => {
    const isEditing = editingCell.rowId === row.id && editingCell.field === column.field;
    const displayValue = column.displayField ? row[column.displayField] : row[column.field];

    if (isEditing) {
      if (column.inputMode === 'select' && column.options) {
        const selectedOption = column.options.find(opt => opt.value === row[column.field]);
        return (
          <div className="w-full relative select-wrapper" onClick={(e) => e.stopPropagation()}>
            <Select
              defaultValue={row[column.field]}
              open={true}
              onValueChange={(value) => {
                handleCellBlur(row.id, column.field, value);
              }}
            >
              <SelectTrigger className="h-full w-full bg-transparent border-none focus:ring-0 p-0 hover:bg-transparent text-base">
                <SelectValue defaultValue={selectedOption?.value} className="text-base" />
              </SelectTrigger>
              <SelectContent>
                {column.options.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-base">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      }
      return (
        <div className="w-full relative">
          <input
            autoFocus
            defaultValue={row[column.field]}
            onBlur={(e) => handleCellBlur(row.id, column.field, e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, row.id, column.field, (e.target as HTMLInputElement).value)}
            className={`absolute inset-0 bg-transparent outline-none p-0 m-0 border-none focus:ring-0 ${cellContentClass} text-base`}
          />
          <div className="invisible">{row[column.field]}</div>
        </div>
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
          {renderInput()}
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
