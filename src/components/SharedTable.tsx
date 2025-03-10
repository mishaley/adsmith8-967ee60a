
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
    
    // Apply filters
    Object.entries(filters).forEach(([field, searchTerm]) => {
      if (searchTerm) {
        filteredData = filteredData.filter(row => {
          const column = columns.find(col => col.field === field);
          
          // Handle select fields (like organization_id) specially
          if (column?.inputMode === 'select' && column.options && column.displayField) {
            // Find the display value for this field using the options
            const matchingOption = column.options.find(opt => opt.value === row[field]);
            if (!matchingOption) return false;
            
            return matchingOption.label.toLowerCase().includes(searchTerm.toLowerCase());
          }
          
          // Default text search
          return String(row[field]).toLowerCase().includes(searchTerm.toLowerCase());
        });
      }
    });

    // Apply sorting
    if (sort.field) {
      const [field, forcedDirection] = sort.field.split(':');
      const direction = forcedDirection || sort.direction;
      
      filteredData.sort((a, b) => {
        const aVal = a[field];
        const bVal = b[field];
        
        if (field === 'created_at') {
          const aDate = new Date(aVal).getTime();
          const bDate = new Date(bVal).getTime();
          return direction === "asc" ? aDate - bDate : bDate - aDate;
        }
        
        return direction === "asc" 
          ? String(aVal).localeCompare(String(bVal)) 
          : String(bVal).localeCompare(String(aVal));
      });
    }
    
    setData(filteredData);
  }, [initialData, sort, filters, columns]);

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
    if (field.includes(':')) {
      const [actualField, forcedDirection] = field.split(':');
      setSort({
        field,
        direction: forcedDirection as "asc" | "desc"
      });
    } else {
      setSort(prev => ({
        field,
        direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc"
      }));
    }
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

  return (
    <div className="w-fit">
      <div className="grid" style={{
        gridTemplateColumns: `repeat(${columns.length}, max-content)`
      }}>
        {columns.map(column => (
          column.format === "M/D/YY" ? (
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
          ) : (
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
              tableName={tableName}
              idField={idField}
            />
          )
        ))}
      </div>
    </div>
  );
}

export default SharedTable;
