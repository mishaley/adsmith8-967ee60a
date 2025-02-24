
import { TableCell as TableCellBase } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColumnDef, TableRow } from "@/types/table";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "../ui/button";
import { X, Save } from "lucide-react";
import { useState, useEffect } from "react";

interface TableCellProps {
  row: TableRow;
  column: ColumnDef;
  isEditing: boolean;
  onUpdate: (value: any) => void;
  onSave?: () => void;
  onCancel?: () => void;
  onClick?: () => void;
}

export function TableCellComponent({ 
  row, 
  column, 
  isEditing, 
  onUpdate,
  onSave,
  onCancel,
  onClick 
}: TableCellProps) {
  const [isActive, setIsActive] = useState(false);

  // When the cell becomes editable, automatically set it to active
  useEffect(() => {
    if (isEditing && column.inputMode === "select") {
      setIsActive(true);
    }
  }, [isEditing, column.inputMode]);

  const formatCell = (value: any, columnFormat?: string) => {
    if (!value) return "";
    if (columnFormat === "M/D/YY") {
      return format(new Date(value), "M/d/yy");
    }
    if (columnFormat === "image" && typeof value === "string") {
      const imageUrl = supabase.storage
        .from("adsmith_assets")
        .getPublicUrl(value).data.publicUrl;
      return <img src={imageUrl} alt="thumbnail" className="w-16 h-16 object-cover rounded" />;
    }
    return value;
  };

  const value = row[column.field];
  const displayValue = column.displayField ? row[column.displayField] : value;

  const renderEditContent = () => {
    if (column.format === "image") {
      return <div>Image upload not implemented yet</div>;
    }

    if (column.inputMode === "select" && column.options) {
      const selectedOption = column.options.find(option => option.value === value);
      return (
        <div onClick={(e) => e.stopPropagation()}>
          <Select
            open={isActive}
            value={value?.toString()}
            onValueChange={(newValue) => {
              onUpdate(newValue);
              setIsActive(false);
            }}
            onOpenChange={(open) => setIsActive(open)}
          >
            <SelectTrigger className="h-10 w-full border-none shadow-none focus:ring-0 p-0 justify-start">
              <SelectValue>
                {selectedOption?.label || "Select..."}
              </SelectValue>
            </SelectTrigger>
            <SelectContent 
              className="z-50 select-content"
              position="popper"
              sideOffset={0}
              align="start"
            >
              {column.options.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value.toString()}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    return (
      <input
        defaultValue={value}
        onFocus={() => setIsActive(true)}
        onBlur={(e) => {
          onUpdate(e.target.value);
          setIsActive(false);
        }}
        autoFocus={column.inputMode === "text"}
        className="w-full h-full bg-transparent focus:outline-none"
      />
    );
  };

  const renderDisplayContent = () => {
    if (column.field === 'created_at' && isEditing) {
      return (
        <div className="flex gap-2 items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSave}
            className="h-8 px-2 hover:bg-green-100"
          >
            <Save className="w-4 h-4 text-green-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-8 px-2 hover:bg-red-100"
          >
            <X className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      );
    }

    return (
      <div className="w-full truncate">
        {column.displayField && row[column.displayField] ? row[column.displayField] : formatCell(value, column.format)}
      </div>
    );
  };

  return (
    <TableCellBase 
      onClick={onClick}
      data-cell-id={`${row.id}-${column.field}`}
      className={`relative w-[1%] whitespace-nowrap cursor-pointer ${
        isEditing ? 'ring-2 ring-[#ecb652] ring-inset bg-white' : ''
      }`}
    >
      <div className="h-12 flex items-center px-4 w-full">
        {isEditing && column.editable ? (
          <div className="w-full">
            {renderEditContent()}
          </div>
        ) : (
          renderDisplayContent()
        )}
      </div>
    </TableCellBase>
  );
}
