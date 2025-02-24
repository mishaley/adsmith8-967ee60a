
import { ColumnDef, TableRow as ITableRow, TableName } from "@/types/table";
import { useState, useEffect } from "react";
import { useTableMutations } from "./table/TableMutations";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface SharedTableProps<T extends TableName> {
  data: ITableRow[];
  columns: ColumnDef[];
  tableName: T;
  idField: string;
}

function SharedTable<T extends TableName>({
  data: initialData,
  columns,
  tableName,
  idField
}: SharedTableProps<T>) {
  const [sort, setSort] = useState({
    field: "created_at",
    direction: "desc" as "asc" | "desc"
  });
  const [data, setData] = useState(initialData);
  const [newRecord, setNewRecord] = useState<Record<string, any>>({});
  const {
    createMutation
  } = useTableMutations(tableName, idField);

  useEffect(() => {
    let sortedData = [...initialData];
    if (sort.field) {
      sortedData.sort((a, b) => {
        const aVal = a[sort.field];
        const bVal = b[sort.field];
        return sort.direction === "asc" ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
      });
    }
    setData(sortedData);
  }, [initialData, sort]);

  const handleAdd = () => {
    const missingFields = columns.filter(col => col.required && !newRecord[col.field]).map(col => col.header);
    if (missingFields.length > 0) {
      toast.error(`Missing required fields: ${missingFields.join(", ")}`);
      return;
    }
    createMutation.mutate(newRecord);
    setNewRecord({});
  };

  const handleInputChange = (field: string, value: any) => {
    setNewRecord(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const organizationOptions = columns.find(col => col.field === "organization_id")?.options || [];

  // Split columns into main and date columns
  const mainColumns = columns.filter(col => !col.format || col.format !== "M/D/YY");
  const dateColumns = columns.filter(col => col.format === "M/D/YY");

  return (
    <div className="w-full">
      {/* Input row container */}
      <div className="grid" style={{
        gridTemplateColumns: "300px 100px"
      }}>
        <div className="bg-[#d3e4fd] p-4 mb-2">
          <Input 
            value={newRecord["organization_name"] || ""} 
            onChange={e => handleInputChange("organization_name", e.target.value)} 
            className="h-10 bg-white w-full rounded-md border border-input" 
          />
        </div>
        <div className="bg-[#d3e4fd] p-4 mb-2">
          <Button 
            onClick={handleAdd} 
            className="h-10 w-[80px] rounded-full bg-[#ecb652] text-[16px] text-[#154851] border-2 border-white hover:bg-[#ecb652]/90"
          >
            ADD
          </Button>
        </div>
      </div>

      {/* Table container */}
      <div className="grid" style={{
        gridTemplateColumns: "300px 100px"
      }}>
        {/* Main columns */}
        {mainColumns.map(column => (
          <div key={column.field} className="flex flex-col h-full">
            <div className="bg-[#154851] p-4 text-white text-[16px] whitespace-nowrap">
              {column.header}
            </div>
            <div className="flex-1 bg-white">
              {data.map(row => (
                <div key={row.id} className="p-4 border-b">
                  {row[column.field]}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Date columns */}
        {dateColumns.map(column => (
          <div key={column.field} className="flex flex-col h-full">
            <div className="bg-[#154851] p-4 text-white text-[16px] whitespace-nowrap">
              {column.header}
            </div>
            <div className="flex-1 bg-white">
              {data.map(row => (
                <div key={row.id} className="p-4 border-b whitespace-nowrap">
                  {row[column.field] ? new Date(row[column.field]).toLocaleDateString('en-US', {
                    month: 'numeric',
                    day: 'numeric',
                    year: '2-digit'
                  }) : ''}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SharedTable;
