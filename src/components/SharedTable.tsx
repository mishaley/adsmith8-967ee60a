
import { Table } from "@/components/ui/table";
import { ColumnDef, TableRow as ITableRow, TableName } from "@/types/table";
import { useState, useEffect, useRef, useCallback } from "react";
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
  const [activeCell, setActiveCell] = useState<{ rowId: string; field: string } | null>(null);
  const [sort, setSort] = useState({ field: "created_at", direction: "desc" as "asc" | "desc" });
  const [data, setData] = useState(initialData);
  const [newRecord, setNewRecord] = useState<Record<string, any>>({});

  const { updateMutation, createMutation } = useTableMutations(tableName, idField);

  useEffect(() => {
    let sortedData = [...initialData];
    if (sort.field) {
      sortedData.sort((a, b) => {
        const aVal = a[sort.field];
        const bVal = b[sort.field];
        return sort.direction === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }
    setData(sortedData);
  }, [initialData, sort]);

  const handleSort = (field: string, direction: "asc" | "desc") => {
    setSort({ field, direction });
  };

  const handleAdd = () => {
    const missingFields = columns
      .filter(col => col.required && !newRecord[col.field])
      .map(col => col.header);

    if (missingFields.length > 0) {
      toast.error(`Missing required fields: ${missingFields.join(", ")}`);
      return;
    }

    createMutation.mutate(newRecord);
    setNewRecord({});
  };

  const handleInputChange = (field: string, value: any) => {
    setNewRecord(prev => ({ ...prev, [field]: value }));
  };

  const handleCellUpdate = (field: string, value: any) => {
    if (!activeCell) return;
    updateMutation.mutate({ 
      rowId: activeCell.rowId, 
      field, 
      value 
    });
    setActiveCell(null);
  };

  const handleCellClick = (rowId: string, field: string) => {
    setActiveCell(rowId && field ? { rowId, field } : null);
  };

  const organizationOptions = columns.find(col => col.field === "organization_id")?.options || [];

  return (
    <div className="grid grid-cols-3 gap-0">
      {/* Column 1: Offering */}
      <div className="flex flex-col">
        <div className="bg-[#d3e4fd] p-4 mb-2">
          <Input
            value={newRecord["offering_name"] || ""}
            onChange={(e) => handleInputChange("offering_name", e.target.value)}
            className="h-10 bg-white w-full rounded-md border border-input"
            placeholder=""
          />
        </div>
        <div className="bg-[#154851] p-4 text-white font-bold uppercase">
          Offering
        </div>
        <div className="flex-1">
          {data.map(row => (
            <div key={row.id} className="p-4 border-b">
              {row.offering_name}
            </div>
          ))}
        </div>
      </div>

      {/* Column 2: Organization */}
      <div className="flex flex-col">
        <div className="bg-[#d3e4fd] p-4 mb-2">
          <Select
            value={newRecord["organization_id"] || ""}
            onValueChange={(value) => handleInputChange("organization_id", value)}
          >
            <SelectTrigger className="h-10 bg-white w-full rounded-md border border-input">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              {organizationOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="bg-[#154851] p-4 text-white font-bold uppercase">
          Organization
        </div>
        <div className="flex-1">
          {data.map(row => (
            <div key={row.id} className="p-4 border-b">
              {row.organization_name}
            </div>
          ))}
        </div>
      </div>

      {/* Column 3: Created */}
      <div className="flex flex-col">
        <div className="bg-[#d3e4fd] p-4 mb-2">
          <Button
            onClick={handleAdd}
            className="h-10 w-[100px] rounded-full bg-[#ecb652] font-bold text-[#154851] border-2 border-white hover:bg-[#ecb652]/90"
          >
            ADD
          </Button>
        </div>
        <div className="bg-[#154851] p-4 text-white font-bold uppercase">
          Created
        </div>
        <div className="flex-1">
          {data.map(row => (
            <div key={row.id} className="p-4 border-b">
              {row.created_at ? new Date(row.created_at).toLocaleDateString() : ''}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SharedTable;
