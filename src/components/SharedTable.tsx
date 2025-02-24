import { ColumnDef, TableRow as ITableRow, TableName } from "@/types/table";
import { useState, useEffect, useRef } from "react";
import { useTableMutations } from "./table/TableMutations";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ChevronDown, Search, ArrowUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

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
  const [filters, setFilters] = useState<Record<string, string>>({});
  const searchInputRef = useRef<HTMLInputElement>(null);
  const {
    createMutation
  } = useTableMutations(tableName, idField);

  useEffect(() => {
    let filteredData = [...initialData];
    
    Object.entries(filters).forEach(([field, searchTerm]) => {
      if (searchTerm) {
        filteredData = filteredData.filter(row => 
          String(row[field]).toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    });

    if (sort.field) {
      filteredData.sort((a, b) => {
        const aVal = a[sort.field];
        const bVal = b[sort.field];
        return sort.direction === "asc" ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
      });
    }
    
    setData(filteredData);
  }, [initialData, sort, filters]);

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

  const handleSort = (field: string) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const handleFilter = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilter = (field: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[field];
      return newFilters;
    });
  };

  const organizationOptions = columns.find(col => col.field === "organization_id")?.options || [];

  const mainColumns = columns.filter(col => !col.format || col.format !== "M/D/YY");
  const dateColumns = columns.filter(col => col.format === "M/D/YY");

  const renderColumnHeader = (column: ColumnDef) => (
    <div className="flex items-center justify-between space-x-2 w-full">
      <span className="truncate">{column.header}</span>
      <Popover>
        <PopoverTrigger asChild>
          <ChevronDown className="h-4 w-4 text-white cursor-pointer" />
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="end">
          <div className="p-2 space-y-2">
            <div className="space-y-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start" 
                onClick={() => handleSort(column.field)}
              >
                Sort A → Z
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start" 
                onClick={() => {
                  handleSort(column.field);
                  setSort(prev => ({ ...prev, direction: "desc" }));
                }}
              >
                Sort Z → A
              </Button>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between mb-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => clearFilter(column.field)}
                >
                  Clear
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  placeholder="Search..."
                  value={filters[column.field] || ""}
                  onChange={(e) => handleFilter(column.field, e.target.value)}
                  className="pl-8"
                  autoFocus
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );

  return <div className="w-full">
      <div className="grid" style={{
      gridTemplateColumns: "minmax(auto, max-content) minmax(100px, max-content)"
    }}>
        {mainColumns.map(column => <div key={column.field} className="flex flex-col h-full">
            <div 
              className="bg-[#154851] p-4 text-white text-[16px] whitespace-nowrap uppercase font-semibold cursor-pointer hover:bg-[#1a5a65] group"
            >
              {renderColumnHeader(column)}
            </div>
            <div className="flex-1">
              <div className="bg-[#d3e4fd] p-4 mb-2">
                <Input value={newRecord[column.field] || ""} onChange={e => handleInputChange(column.field, e.target.value)} className="h-10 bg-white w-full rounded-md border border-input" />
              </div>
              <div className="bg-white">
                {data.map(row => <div key={row.id} className="p-4 border-b">
                    {row[column.field]}
                  </div>)}
              </div>
            </div>
          </div>)}

        {dateColumns.map(column => <div key={column.field} className="flex flex-col h-full">
            <div 
              className="bg-[#154851] p-4 text-white text-[16px] whitespace-nowrap uppercase font-semibold cursor-pointer hover:bg-[#1a5a65] group"
            >
              {renderColumnHeader(column)}
            </div>
            <div className="flex-1">
              <div className="bg-[#d3e4fd] p-4 mb-2">
                <Button onClick={handleAdd} className="h-10 w-[80px] rounded-full bg-[#ecb652] text-[16px] text-[#154851] border-2 border-white hover:bg-[#ecb652]/90 font-bold">
                  ADD
                </Button>
              </div>
              <div className="bg-white">
                {data.map(row => <div key={row.id} className="p-4 border-b whitespace-nowrap">
                    {row[column.field] ? new Date(row[column.field]).toLocaleDateString('en-US', {
                month: 'numeric',
                day: 'numeric',
                year: '2-digit'
              }) : ''}
                  </div>)}
              </div>
            </div>
          </div>)}
      </div>
    </div>;
}

export default SharedTable;
