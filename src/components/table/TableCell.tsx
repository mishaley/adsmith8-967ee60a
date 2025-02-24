
import { TableCell as TableCellBase } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColumnDef, TableRow } from "@/types/table";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "../ui/button";
import { X, Save } from "lucide-react";
import { useState } from "react";

interface TableCellProps {
  row: TableRow;
  column: ColumnDef;
  isEditing: boolean;
  onUpdate: (value: any) => void;
  onSave?: () => void;
  onCancel?: () => void;
}

export function TableCellComponent({ 
  row, 
  column, 
  isEditing, 
  onUpdate,
  onSave,
  onCancel 
}: TableCellProps) {
  const [isActive, setIsActive] = useState(false);

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
        <Select
          value={value?.toString()}
          onValueChange={(newValue) => {
            onUpdate(newValue);
            setIsActive(false);
          }}
          onOpenChange={(open) => setIsActive(open)}
        >
          <SelectTrigger className="h-10 w-full border-none shadow-none focus:ring-0">
            <SelectValue>
              {selectedOption?.label || "Select..."}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {column.options.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
    <td className={`p-0 relative w-full box-border ${
      isEditing 
        ? 'bg-white' + (isActive ? ' outline outline-2 outline-[#ecb652]' : '')
        : ''
    }`}>
      <div className="h-12 w-full px-4 flex items-center">
        {isEditing && column.editable ? (
          <div className="w-full">
            {renderEditContent()}
          </div>
        ) : (
          renderDisplayContent()
        )}
      </div>
    </td>
  );
}
