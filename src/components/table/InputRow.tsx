
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColumnDef, TableData, TableName } from "@/types/table";

interface InputRowProps {
  columns: ColumnDef[];
  newRecord: Partial<TableData<any>>;
  handleInputChange: (field: string, value: any) => void;
  handleAdd: () => void;
}

export function InputRow({
  columns,
  newRecord,
  handleInputChange,
  handleAdd,
}: InputRowProps) {
  const renderInput = (column: ColumnDef) => {
    if (column.field === 'created_at') {
      return (
        <div className="flex items-center h-10">
          <Button
            onClick={handleAdd}
            className="h-10 w-[100px] rounded-full bg-[#ecb652] font-bold text-[#154851] border-2 border-white hover:bg-[#ecb652]/90"
          >
            ADD
          </Button>
        </div>
      );
    }

    if (column.inputMode === "select" && column.options) {
      return (
        <Select
          value={newRecord[column.field] || ""}
          onValueChange={(value) => handleInputChange(column.field, value)}
        >
          <SelectTrigger className="h-10 bg-white w-full rounded-md border border-input">
            <SelectValue placeholder="" />
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
        onChange={(e) => handleInputChange(column.field, e.target.value)}
        className="h-10 bg-white w-full rounded-md border border-input"
        placeholder=""
      />
    );
  };

  return (
    <div className="mb-[9px]">
      <div className="grid bg-[#d3e4fd] px-4 py-4" style={{ gridTemplateColumns: 'repeat(3, 33.33%)' }}>
        {columns.map((column) => (
          <div key={column.field} className="px-4">
            {renderInput(column)}
          </div>
        ))}
      </div>
    </div>
  );
}
