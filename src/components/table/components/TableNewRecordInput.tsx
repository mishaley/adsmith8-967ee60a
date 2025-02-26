
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
  if (column.newRecordHidden) {
    return null;
  }

  if (column.inputMode === 'select' && column.options) {
    return (
      <div className="-ml-4">
        <Select
          value={value || ""}
          onValueChange={onChange}
        >
          <SelectTrigger className="h-10 bg-white w-full rounded-md border border-input text-base px-4">
            <SelectValue />
          </SelectTrigger>
          <SelectContent 
            className="bg-white border rounded-md shadow-md z-50 w-[var(--radix-select-trigger-width)]"
            align="start"
            sideOffset={0}
            alignOffset={0}
          >
            {column.options.map((option) => (
              <SelectItem key={option.value} value={option.value} className="text-base pl-8">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="-ml-4">
      <Input 
        value={value || ""} 
        onChange={e => onChange(e.target.value)} 
        className="h-10 bg-white w-full rounded-md border border-input !text-base px-4"
        style={{ fontSize: '16px' }}
      />
    </div>
  );
}
