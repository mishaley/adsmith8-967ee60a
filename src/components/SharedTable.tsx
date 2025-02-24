import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { ColumnDef, TableRow as ITableRow, TableName } from "@/types/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SharedTableProps {
  data: ITableRow[];
  columns: ColumnDef[];
  tableName: TableName;
  idField: string;
}

type UpdateVariables = {
  rowId: string;
  field: string;
  value: any;
};

type SortDirection = "asc" | "desc" | null;
type FilterState = { search: string; values: Set<string> };
type Filters = { [key: string]: FilterState };

const SharedTable = ({ data: initialData, columns, tableName, idField }: SharedTableProps) => {
  const [editingCell, setEditingCell] = useState<{ rowId: string; field: string } | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [filters, setFilters] = useState<Filters>({});
  const [data, setData] = useState(initialData);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const newFilters: Filters = {};
    columns.forEach(column => {
      newFilters[column.field] = {
        search: "",
        values: new Set(initialData.map(row => String(row[column.field])))
      };
    });
    setFilters(newFilters);
  }, [columns, initialData]);

  useEffect(() => {
    let filteredData = [...initialData];

    Object.entries(filters).forEach(([field, filter]) => {
      if (filter.values.size > 0) {
        filteredData = filteredData.filter(row => 
          filter.values.has(String(row[field]))
        );
      }
    });

    if (sortField) {
      filteredData.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        
        if (sortDirection === "asc") {
          return String(aVal).localeCompare(String(bVal));
        } else {
          return String(bVal).localeCompare(String(aVal));
        }
      });
    }

    setData(filteredData);
  }, [initialData, filters, sortField, sortDirection]);

  const updateMutation = useMutation({
    mutationKey: [tableName, 'update'],
    mutationFn: async ({ rowId, field, value }: UpdateVariables) => {
      const { error } = await supabase
        .from(tableName)
        .update({ [field]: value })
        .eq(idField, rowId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tableName.replace(/^\w+/, "").toLowerCase()] });
      setEditingCell(null);
    },
  });

  const handleFilterChange = (field: string, searchTerm: string, allValues: any[]) => {
    const lowercaseSearch = searchTerm.toLowerCase();
    const filteredValues = new Set(
      allValues
        .filter(value => 
          String(value).toLowerCase().includes(lowercaseSearch)
        )
        .map(String)
    );

    setFilters(prev => ({
      ...prev,
      [field]: {
        search: searchTerm,
        values: filteredValues
      }
    }));
  };

  const handleSort = (field: string, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
    setActiveFilter(null);
  };

  const formatCell = (value: any, columnFormat?: string) => {
    if (!value) return "";
    if (columnFormat === "M/D/YY") {
      return format(new Date(value), "M/d/yy");
    }
    if (columnFormat === "image" && typeof value === "string") {
      const imageUrl = supabase.storage
        .from("adsmith_assets")
        .getPublicUrl(value).data.publicUrl;
      return <img src={imageUrl} alt="thumbnail" className="w-16 h-16 object-cover rounded" />;
    }
    return value;
  };

  const renderCell = (row: ITableRow, column: ColumnDef) => {
    const isEditing = editingCell?.rowId === row.id && editingCell?.field === column.field;
    const value = row[column.field];
    const displayValue = column.displayField ? row[column.displayField] : value;

    if (isEditing) {
      if (column.format === "image") {
        return <div>Image upload not implemented yet</div>;
      }

      if (column.inputMode === "select" && column.options) {
        return (
          <Select
            defaultValue={value}
            onValueChange={(newValue) => {
              updateMutation.mutate({ rowId: row.id, field: column.field, value: newValue });
            }}
          >
            <SelectTrigger>
              <SelectValue>{displayValue}</SelectValue>
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
          defaultValue={value}
          onBlur={(e) => {
            updateMutation.mutate({ rowId: row.id, field: column.field, value: e.target.value });
          }}
        />
      );
    }

    if (column.format) {
      return formatCell(value, column.format);
    }

    return displayValue;
  };

  return (
    <Table>
      <TableHeader className="bg-[#154851]">
        <TableRow>
          {columns.map((column) => (
            <TableHead 
              key={column.field} 
              className="text-white font-bold uppercase flex items-center justify-between"
            >
              <span>{column.header}</span>
              <Popover 
                open={activeFilter === column.field}
                onOpenChange={(open) => {
                  setActiveFilter(open ? column.field : null);
                  if (open) {
                    setTimeout(() => {
                      searchInputRef.current?.focus();
                    }, 0);
                  }
                }}
              >
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="h-8 w-8 p-0 text-white hover:bg-[#1e5f6a]"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56" align="start">
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="ghost"
                        className="justify-start"
                        onClick={() => handleSort(column.field, "asc")}
                      >
                        Sort A to Z
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start"
                        onClick={() => handleSort(column.field, "desc")}
                      >
                        Sort Z to A
                      </Button>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Button
                          variant="ghost"
                          className="h-8 text-xs"
                          onClick={() => handleFilterChange(
                            column.field,
                            "",
                            initialData.map(row => row[column.field])
                          )}
                        >
                          Select all
                        </Button>
                        <Button
                          variant="ghost"
                          className="h-8 text-xs"
                          onClick={() => handleFilterChange(column.field, "", [])}
                        >
                          Clear
                        </Button>
                      </div>
                      <Input
                        ref={searchInputRef}
                        placeholder="Search..."
                        value={filters[column.field]?.search || ""}
                        onChange={(e) => handleFilterChange(
                          column.field,
                          e.target.value,
                          initialData.map(row => row[column.field])
                        )}
                        className="h-8"
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className="bg-white">
        {data.map((row) => (
          <TableRow key={row.id}>
            {columns.map((column) => (
              <TableCell
                key={column.field}
                className="text-[#2A2A2A]"
                onClick={() => {
                  if (column.editable) {
                    setEditingCell({ rowId: row.id, field: column.field });
                  }
                }}
              >
                {renderCell(row, column)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SharedTable;
