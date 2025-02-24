
import { TableCell as TableCellBase } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColumnDef, TableRow } from "@/types/table";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface TableCellProps {
  row: TableRow;
  column: ColumnDef;
  isEditing: boolean;
  onUpdate: (value: any) => void;
}

export function TableCellComponent({ row, column, isEditing, onUpdate }: TableCellProps) {
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

  if (isEditing) {
    if (column.format === "image") {
      return <div>Image upload not implemented yet</div>;
    }

    if (column.inputMode === "select" && column.options) {
      return (
        <Select
          defaultValue={value}
          onValueChange={onUpdate}
        >
          <SelectTrigger>
            <SelectValue>{displayValue}</SelectValue>
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
        defaultValue={value}
        onBlur={(e) => onUpdate(e.target.value)}
      />
    );
  }

  if (column.format) {
    return formatCell(value, column.format);
  }

  return displayValue;
}
