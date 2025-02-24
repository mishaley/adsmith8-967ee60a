
import { ColumnDef, TableRow as ITableRow, TableName } from "@/types/table";
import { useState, useEffect, useRef } from "react";
import { useTableMutations } from "./table/TableMutations";
import { toast } from "sonner";
import { TableColumn } from "./table/TableColumn";
import { TableAddColumn } from "./table/TableAddColumn";

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
  const { createMutation } = useTableMutations(tableName, idField);

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
        return sort.direction === "asc" 
          ? String(aVal).localeCompare(String(bVal)) 
          : String(bVal).localeCompare(String(aVal));
      });
    }
    
    setData(filteredData);
  }, [initialData, sort, filters]);

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

  const mainColumns = columns.filter(col => !col.format || col.format !== "M/D/YY");
  const dateColumns = columns.filter(col => col.format === "M/D/YY");

  return (
    <div className="w-full">
      <div className="grid" style={{
        gridTemplateColumns: "minmax(auto, max-content) minmax(100px, max-content)"
      }}>
        {mainColumns.map(column => (
          <TableColumn
            key={column.field}
            column={column}
            data={data}
            newRecord={newRecord}
            handleInputChange={handleInputChange}
            handleSort={handleSort}
            handleFilter={handleFilter}
            clearFilter={clearFilter}
            filters={filters}
            searchInputRef={searchInputRef}
          />
        ))}
        
        {dateColumns.map(column => (
          <TableAddColumn
            key={column.field}
            column={column}
            data={data}
            handleAdd={handleAdd}
            handleSort={handleSort}
            handleFilter={handleFilter}
            clearFilter={clearFilter}
            filters={filters}
            searchInputRef={searchInputRef}
          />
        ))}
      </div>
    </div>
  );
}

export default SharedTable;
