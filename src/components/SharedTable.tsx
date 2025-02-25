
import { ColumnDef, TableRow as ITableRow, TableName, DbRecord, DbInsert, asTableField } from "@/types/table";
import { useState, useEffect, useRef } from "react";
import { useTableMutations } from "./table/TableMutations";
import { toast } from "sonner";
import { TableColumn } from "./table/TableColumn";
import { TableAddColumn } from "./table/TableAddColumn";

interface SharedTableProps<T extends TableName> {
  data: ITableRow[];
  columns: ColumnDef[];
  tableName: T;
  idField: keyof DbRecord<T>;
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
  const [newRecord, setNewRecord] = useState<Partial<DbInsert<T>>>({});
  const [filters, setFilters] = useState<Record<string, string>>({});
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { createMutation } = useTableMutations<T>(tableName, idField);

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
  }, [initialData, sort, filters]);

  const handleAdd = () => {
    const missingFields = columns
      .filter(col => col.required && !newRecord[col.field as keyof DbInsert<T>])
      .map(col => col.header);
    if (missingFields.length > 0) {
      toast.error(`Missing required fields: ${missingFields.join(", ")}`);
      return;
    }
    createMutation.mutate(newRecord as DbInsert<T>);
    setNewRecord({});
  };

  const handleInputChange = (field: keyof DbRecord<T>, value: any) => {
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
    <div className="w-full">
      <div className="grid" style={{
        gridTemplateColumns: `repeat(${columns.length}, minmax(100px, max-content))`
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
            <TableColumn<T>
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
