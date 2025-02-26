
import { SelectOption } from "@/types/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TableSelectCellProps {
  value: string;
  displayValue: string;
  options: SelectOption[];
  onSelect: (value: string) => void;
  onOpenChange: (open: boolean) => void;
}

export function TableSelectCell({
  value,
  displayValue,
  options,
  onSelect,
  onOpenChange
}: TableSelectCellProps) {
  return (
    <Select
      defaultValue={value}
      onValueChange={onSelect}
      defaultOpen={true}
      onOpenChange={onOpenChange}
    >
      <SelectTrigger className="w-full h-full border-none shadow-none focus:ring-0 px-0 bg-transparent text-base font-normal flex items-center">
        <SelectValue className="text-left" placeholder={displayValue} />
      </SelectTrigger>
      <SelectContent 
        className="bg-white border rounded-md shadow-md z-50 min-w-[200px]"
        position="popper"
        sideOffset={5}
      >
        {options.map((option) => (
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
