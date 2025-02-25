
import { TableRow, ColumnDef } from "@/types/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TableCellEditorProps {
  row: TableRow;
  column: ColumnDef;
  onBlur: (value: any) => void;
  cellContentClass: string;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function TableCellEditor({ row, column, onBlur }: TableCellEditorProps) {
  if (column.inputMode === 'select' && column.options) {
    return (
      <div className="w-full relative select-wrapper">
        <Select 
          onValueChange={onBlur} 
          defaultValue={row[column.field]}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {column.options.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
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
    <div className="w-full relative">
      <input
        autoFocus
        defaultValue={row[column.field]}
        onBlur={(e) => onBlur(e.target.value)}
        onKeyPress={onKeyPress}
        className={`absolute inset-0 bg-transparent outline-none p-0 m-0 border-none focus:ring-0 ${cellContentClass} text-base`}
      />
      <div className="invisible">{row[column.field]}</div>
    </div>
  );
}
