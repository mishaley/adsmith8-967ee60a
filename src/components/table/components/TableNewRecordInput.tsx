
import { ColumnDef } from "@/types/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TableNewRecordInputProps {
  column: ColumnDef;
  value: any;
  onChange: (value: any) => void;
  cellContentClass: string;
}

export function TableNewRecordInput({ column, value, onChange, cellContentClass }: TableNewRecordInputProps) {
  if (column.inputMode === 'select' && column.options) {
    return (
      <Select
        value={value || ""}
        onValueChange={onChange}
      >
        <SelectTrigger className="h-10 bg-white w-full rounded-md border border-input text-base">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {column.options.map((option) => (
            <SelectItem key={option.value} value={option.value} className="text-base">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Input 
      value={value || ""} 
      onChange={e => onChange(e.target.value)} 
      className="h-10 bg-white w-full rounded-md border border-input !text-base"
      style={{ fontSize: '16px' }}
    />
  );
}
